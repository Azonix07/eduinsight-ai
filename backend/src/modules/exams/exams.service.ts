import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Exam, ExamDocument } from '../../database/schemas/exam.schema';
import { AnswerSheet, AnswerSheetDocument } from '../../database/schemas/answer-sheet.schema';

@Injectable()
export class ExamsService {
  private readonly logger = new Logger(ExamsService.name);

  constructor(
    @InjectModel(Exam.name) private examModel: Model<ExamDocument>,
    @InjectModel(AnswerSheet.name) private answerSheetModel: Model<AnswerSheetDocument>,
  ) {}

  async create(data: Partial<Exam>) {
    return this.examModel.create(data);
  }

  async findAll(query: {
    page?: number; limit?: number; school?: string; teacher?: string;
    grade?: string; status?: string; type?: string;
  }) {
    const { page = 1, limit = 20, school, teacher, grade, status, type } = query;
    const filter: Record<string, unknown> = {};
    if (school) filter.school = new Types.ObjectId(school);
    if (teacher) filter.teacher = new Types.ObjectId(teacher);
    if (grade) filter.grade = grade;
    if (status) filter.status = status;
    if (type) filter.type = type;

    const [exams, total] = await Promise.all([
      this.examModel
        .find(filter)
        .populate('subject', 'name code')
        .populate('teacher', 'user')
        .populate('school', 'name code')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ date: -1 }),
      this.examModel.countDocuments(filter),
    ]);

    return { exams, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string) {
    const exam = await this.examModel
      .findById(id)
      .populate('subject', 'name code')
      .populate('school', 'name code');
    if (!exam) throw new NotFoundException('Exam not found');
    return exam;
  }

  async update(id: string, updates: Partial<Exam>) {
    const exam = await this.examModel.findByIdAndUpdate(id, { $set: updates }, { new: true });
    if (!exam) throw new NotFoundException('Exam not found');
    return exam;
  }

  async updateStatus(id: string, status: string) {
    return this.update(id, { status } as Partial<Exam>);
  }

  /** Get answer sheets for an exam */
  async getAnswerSheets(examId: string, query: { page?: number; limit?: number }) {
    const { page = 1, limit = 50 } = query;
    const filter = { exam: new Types.ObjectId(examId) };

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

  /** Get a single answer sheet */
  async getAnswerSheet(id: string) {
    const sheet = await this.answerSheetModel
      .findById(id)
      .populate('exam')
      .populate('student');
    if (!sheet) throw new NotFoundException('Answer sheet not found');
    return sheet;
  }

  /** Create answer sheet (after file upload) */
  async createAnswerSheet(data: Partial<AnswerSheet>) {
    const sheet = await this.answerSheetModel.create({
      ...data,
      uploadedAt: new Date(),
    });

    // Increment counter on exam
    await this.examModel.findByIdAndUpdate(data.exam, {
      $inc: { totalAnswerSheets: 1 },
    });

    return sheet;
  }

  /** Update answer sheet evaluation */
  async updateAnswerSheet(id: string, updates: Partial<AnswerSheet>) {
    const sheet = await this.answerSheetModel.findByIdAndUpdate(id, { $set: updates }, { new: true });
    if (!sheet) throw new NotFoundException('Answer sheet not found');
    return sheet;
  }

  /** Get exam statistics */
  async getExamStats(examId: string) {
    const sheets = await this.answerSheetModel.find({
      exam: new Types.ObjectId(examId),
      'evaluation.status': 'completed',
    });

    if (sheets.length === 0) return { totalSheets: 0, averageScore: 0, passRate: 0, highestScore: 0, lowestScore: 0 };

    const exam = await this.examModel.findById(examId);
    const scores = sheets.map((s) => s.evaluation.percentage);

    return {
      totalSheets: sheets.length,
      averageScore: +(scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1),
      passRate: +((scores.filter((s) => s >= ((exam?.passingMarks || 40) / (exam?.maxMarks || 100)) * 100).length / scores.length) * 100).toFixed(1),
      highestScore: Math.max(...scores),
      lowestScore: Math.min(...scores),
    };
  }
}
