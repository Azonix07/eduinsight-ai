import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AnswerSheetDocument = AnswerSheet & Document;

@Schema({ timestamps: true })
export class AnswerSheet {
  @Prop({ type: Types.ObjectId, ref: 'Exam', required: true, index: true })
  exam: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Student', required: true, index: true })
  student: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'School', required: true })
  school: Types.ObjectId;

  @Prop({ type: [Object], default: [] })
  files: Array<{ url: string; publicId: string; pageNumber: number; format: string }>;

  @Prop({
    type: Object,
    default: { extractedText: '', structuredContent: [], status: 'pending', processedAt: null },
  })
  ocrResult: {
    extractedText: string;
    structuredContent: Array<{
      questionNumber: number;
      answerText: string;
      hasDiagrams: boolean;
      hasEquations: boolean;
      confidence: number;
    }>;
    status: string;
    processedAt?: Date;
  };

  @Prop({
    type: Object,
    default: { totalMarks: 0, maxMarks: 0, percentage: 0, grade: '', questionResults: [], status: 'pending' },
  })
  evaluation: {
    totalMarks: number;
    maxMarks: number;
    percentage: number;
    grade: string;
    questionResults: Array<{
      questionNumber: number;
      marksAwarded: number;
      maxMarks: number;
      feedback: string;
      improvementSuggestion: string;
      errors: Array<{ type: string; description: string }>;
      isOverridden: boolean;
      overriddenBy?: Types.ObjectId;
      overrideReason?: string;
    }>;
    status: string;
    evaluatedAt?: Date;
    reviewedBy?: Types.ObjectId;
  };

  @Prop({
    type: Object,
    default: {
      strengths: [], weaknesses: [], learningStyle: 'analytical',
      conceptUnderstanding: 0, writingQuality: 0, criticalThinking: 0,
      analyticalAbility: 0, problemSolving: 0,
    },
  })
  analysis: {
    strengths: string[];
    weaknesses: string[];
    learningStyle: string;
    conceptUnderstanding: number;
    writingQuality: number;
    criticalThinking: number;
    analyticalAbility: number;
    problemSolving: number;
  };

  @Prop()
  uploadedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  uploadedBy?: Types.ObjectId;
}

export const AnswerSheetSchema = SchemaFactory.createForClass(AnswerSheet);
