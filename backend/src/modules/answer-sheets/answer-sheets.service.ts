import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AnswerSheet, AnswerSheetDocument } from '../../database/schemas/answer-sheet.schema';
import { Exam, ExamDocument } from '../../database/schemas/exam.schema';
import { Student, StudentDocument } from '../../database/schemas/student.schema';
import { AiService } from '../ai/ai.service';
import { CloudinaryService } from '../uploads/cloudinary.service';
import { OCR_PROMPT, EVALUATION_PROMPT, ANALYSIS_PROMPT } from '../ai/prompts/prompts';

interface OcrStructured {
  questionNumber: number;
  answerText: string;
  hasDiagrams: boolean;
  hasEquations: boolean;
  confidence: number;
}

export interface UploadFile {
  buffer: Buffer;
  mimetype: string;
}

@Injectable()
export class AnswerSheetsService {
  private readonly logger = new Logger(AnswerSheetsService.name);

  constructor(
    @InjectModel(AnswerSheet.name) private answerSheetModel: Model<AnswerSheetDocument>,
    @InjectModel(Exam.name) private examModel: Model<ExamDocument>,
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    private aiService: AiService,
    private cloudinary: CloudinaryService,
  ) {}

  /** Upload answer-sheet images, run OCR on each page, and create the record. */
  async uploadAndExtract(examId: string, studentId: string, files: UploadFile[], uploadedBy: string) {
    if (!files?.length) throw new BadRequestException('No files uploaded');

    const exam = await this.examModel.findById(examId);
    if (!exam) throw new NotFoundException('Exam not found');

    // Upload to Cloudinary + OCR each page in parallel
    const pages = await Promise.all(
      files.map(async (file, index) => {
        const uploaded = await this.cloudinary.uploadImage(file.buffer, `answer-sheets/${examId}`);
        const ocr = await this.runOcr(file.buffer, file.mimetype);
        return {
          file: {
            url: uploaded.url,
            publicId: uploaded.publicId,
            pageNumber: index + 1,
            format: uploaded.format,
          },
          ocr,
        };
      }),
    );

    const structuredContent: OcrStructured[] = pages.flatMap((p) => p.ocr.structuredContent);
    const extractedText = pages.map((p) => p.ocr.extractedText).join('\n\n');

    const sheet = await this.answerSheetModel.create({
      exam: new Types.ObjectId(examId),
      student: new Types.ObjectId(studentId),
      school: exam.school,
      files: pages.map((p) => p.file),
      ocrResult: {
        extractedText,
        structuredContent,
        status: 'completed',
        processedAt: new Date(),
      },
      uploadedAt: new Date(),
      uploadedBy: new Types.ObjectId(uploadedBy),
    });

    await this.examModel.findByIdAndUpdate(examId, { $inc: { totalAnswerSheets: 1 } });
    this.logger.log(`Answer sheet ${sheet._id} uploaded for exam ${examId} (${pages.length} page(s))`);

    return sheet;
  }

  /** Evaluate an answer sheet against the exam marking scheme, then run a deep analysis. */
  async evaluate(id: string) {
    const sheet = await this.answerSheetModel.findById(id);
    if (!sheet) throw new NotFoundException('Answer sheet not found');

    const exam = await this.examModel.findById(sheet.exam);
    if (!exam) throw new NotFoundException('Exam not found');

    const hasAnswers = Boolean(sheet.ocrResult?.structuredContent?.length);
    let questionResults: Array<{
      questionNumber: number;
      marksAwarded: number;
      maxMarks: number;
      feedback: string;
      improvementSuggestion: string;
      errors: Array<{ type: string; description: string }>;
      isOverridden: boolean;
    }>;

    if (!hasAnswers) {
      // Blank or unreadable sheet: grade as zero against the marking scheme
      // rather than erroring — a missing answer is a result, not a failure.
      questionResults = (exam.markingScheme ?? []).map((q) => ({
        questionNumber: q.questionNumber,
        marksAwarded: 0,
        maxMarks: q.maxMarks,
        feedback: 'No answer was detected for this question.',
        improvementSuggestion: 'Ensure the answer is written clearly and the page is scanned fully.',
        errors: [{ type: 'incomplete', description: 'No answer detected on the sheet' }],
        isOverridden: false,
      }));
    } else {
      const markingScheme = JSON.stringify(exam.markingScheme ?? [], null, 2);
      const studentAnswers = sheet.ocrResult.structuredContent
        .map((a) => `Q${a.questionNumber}: ${a.answerText}`)
        .join('\n\n');

      const evalRaw = await this.aiService.complete(
        'You are an expert academic evaluator. Respond only in valid JSON.',
        EVALUATION_PROMPT.replace('{markingScheme}', markingScheme).replace('{studentAnswers}', studentAnswers),
      );

      const evalParsed = this.safeJson<{
        questionResults?: Array<{
          questionNumber: number;
          marksAwarded: number;
          maxMarks: number;
          feedback: string;
          improvementSuggestion: string;
          errors: Array<{ type: string; description: string }>;
        }>;
      }>(evalRaw);

      questionResults = (evalParsed?.questionResults ?? []).map((q) => ({
        questionNumber: q.questionNumber,
        marksAwarded: q.marksAwarded ?? 0,
        maxMarks: q.maxMarks ?? 0,
        feedback: q.feedback ?? '',
        improvementSuggestion: q.improvementSuggestion ?? '',
        errors: Array.isArray(q.errors) ? q.errors : [],
        isOverridden: false,
      }));
    }

    const maxMarks = questionResults.reduce((sum, q) => sum + q.maxMarks, 0) || exam.maxMarks;
    const totalMarks = questionResults.reduce((sum, q) => sum + q.marksAwarded, 0);
    const percentage = maxMarks > 0 ? +((totalMarks / maxMarks) * 100).toFixed(1) : 0;

    sheet.evaluation = {
      totalMarks,
      maxMarks,
      percentage,
      grade: this.toGrade(percentage),
      questionResults,
      status: 'completed',
      evaluatedAt: new Date(),
    };
    sheet.markModified('evaluation');

    // Deep analysis only makes sense when there are answers to analyse.
    if (hasAnswers) {
      const analysis = await this.runAnalysis(sheet);
      if (analysis) {
        sheet.analysis = analysis;
        sheet.markModified('analysis');
      }
    }

    await sheet.save();

    // Append to the student's performance history (best-effort).
    await this.recordPerformance(sheet, exam).catch((e) =>
      this.logger.warn(`Could not record performance history: ${(e as Error).message}`),
    );

    this.logger.log(`Answer sheet ${id} evaluated: ${totalMarks}/${maxMarks} (${percentage}%)`);
    return sheet;
  }

  /** Teacher/admin override of a single question's marks; recomputes the total. */
  async overrideQuestion(
    id: string,
    questionNumber: number,
    marksAwarded: number,
    reason: string,
    reviewerId: string,
  ) {
    const sheet = await this.answerSheetModel.findById(id);
    if (!sheet) throw new NotFoundException('Answer sheet not found');

    const question = sheet.evaluation?.questionResults?.find((r) => r.questionNumber === questionNumber);
    if (!question) throw new NotFoundException(`Question ${questionNumber} not found on this answer sheet`);

    question.marksAwarded = Math.min(Math.max(marksAwarded, 0), question.maxMarks);
    question.isOverridden = true;
    question.overriddenBy = new Types.ObjectId(reviewerId);
    question.overrideReason = reason;

    const totalMarks = sheet.evaluation.questionResults.reduce((s, r) => s + r.marksAwarded, 0);
    sheet.evaluation.totalMarks = totalMarks;
    sheet.evaluation.percentage =
      sheet.evaluation.maxMarks > 0 ? +((totalMarks / sheet.evaluation.maxMarks) * 100).toFixed(1) : 0;
    sheet.evaluation.grade = this.toGrade(sheet.evaluation.percentage);
    sheet.evaluation.reviewedBy = new Types.ObjectId(reviewerId);

    sheet.markModified('evaluation');
    await sheet.save();
    return sheet;
  }

  async findOne(id: string) {
    const sheet = await this.answerSheetModel.findById(id).populate('exam').populate('student');
    if (!sheet) throw new NotFoundException('Answer sheet not found');
    return sheet;
  }

  async findAll(query: { exam?: string; student?: string; school?: string; page?: number; limit?: number }) {
    const { exam, student, school, page = 1, limit = 50 } = query;
    const filter: Record<string, unknown> = {};
    if (exam) filter.exam = new Types.ObjectId(exam);
    if (student) filter.student = new Types.ObjectId(student);
    if (school) filter.school = new Types.ObjectId(school);

    const [sheets, total] = await Promise.all([
      this.answerSheetModel
        .find(filter)
        .populate('student', 'rollNumber grade section')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 }),
      this.answerSheetModel.countDocuments(filter),
    ]);

    return { sheets, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  /** Run OCR on a single image buffer. */
  private async runOcr(buffer: Buffer, mimetype: string) {
    const raw = await this.aiService.analyzeImage(buffer.toString('base64'), OCR_PROMPT, mimetype);
    const parsed = this.safeJson<{ extractedText?: string; structuredContent?: OcrStructured[] }>(raw);
    return {
      extractedText: parsed?.extractedText ?? '',
      structuredContent: Array.isArray(parsed?.structuredContent) ? parsed.structuredContent : [],
    };
  }

  /** Best-effort deep analysis using the student's recent performance history. */
  private async runAnalysis(sheet: AnswerSheetDocument) {
    try {
      const student = await this.studentModel.findById(sheet.student);
      const history = student?.performanceHistory?.length
        ? JSON.stringify(student.performanceHistory.slice(-10))
        : 'No prior performance history available.';

      const raw = await this.aiService.complete(
        'You are an educational psychologist. Respond only in valid JSON.',
        ANALYSIS_PROMPT.replace('{evaluationResults}', JSON.stringify(sheet.evaluation)).replace(
          '{studentHistory}',
          history,
        ),
      );

      const parsed = this.safeJson<Record<string, unknown>>(raw);
      if (!parsed || parsed.strengths === undefined) return null;

      return {
        strengths: (parsed.strengths as string[]) ?? [],
        weaknesses: (parsed.weaknesses as string[]) ?? [],
        learningStyle: (parsed.learningStyle as string) ?? 'analytical',
        conceptUnderstanding: (parsed.conceptUnderstanding as number) ?? 0,
        writingQuality: (parsed.writingQuality as number) ?? 0,
        criticalThinking: (parsed.criticalThinking as number) ?? 0,
        analyticalAbility: (parsed.analyticalAbility as number) ?? 0,
        problemSolving: (parsed.problemSolving as number) ?? 0,
      };
    } catch (e) {
      this.logger.warn(`Analysis step failed: ${(e as Error).message}`);
      return null;
    }
  }

  private async recordPerformance(sheet: AnswerSheetDocument, exam: ExamDocument) {
    // Re-evaluations replace the existing entry for this exam instead of duplicating it.
    await this.studentModel.findByIdAndUpdate(sheet.student, {
      $pull: { performanceHistory: { examId: exam._id } },
    });
    await this.studentModel.findByIdAndUpdate(sheet.student, {
      $push: {
        performanceHistory: {
          examId: exam._id,
          subjectId: exam.subject,
          marks: sheet.evaluation.totalMarks,
          maxMarks: sheet.evaluation.maxMarks,
          date: new Date(),
        },
      },
    });
  }

  private toGrade(percentage: number): string {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    if (percentage >= 40) return 'D';
    return 'F';
  }

  /** Parse JSON, tolerating models that wrap output in prose or code fences. */
  private safeJson<T>(raw: string): T | null {
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          return JSON.parse(match[0]) as T;
        } catch {
          return null;
        }
      }
      return null;
    }
  }
}
