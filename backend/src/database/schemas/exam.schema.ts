import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ExamDocument = Exam & Document;

@Schema({ timestamps: true })
export class Exam {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, enum: ['assignment', 'unit_test', 'midterm', 'final', 'quiz', 'practice'] })
  type: string;

  @Prop({ type: Types.ObjectId, ref: 'Subject', required: true })
  subject: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'School', required: true, index: true })
  school: Types.ObjectId;

  @Prop({ required: true })
  grade: string;

  @Prop()
  section?: string;

  @Prop({ type: Types.ObjectId, ref: 'Teacher', required: true })
  teacher: Types.ObjectId;

  @Prop({ required: true })
  date: Date;

  @Prop()
  duration?: number;

  @Prop({ required: true })
  maxMarks: number;

  @Prop({ required: true })
  passingMarks: number;

  @Prop({ type: [Object], default: [] })
  markingScheme: Array<{
    questionNumber: number;
    maxMarks: number;
    topic: string;
    answerKey?: string;
    rubric?: string;
  }>;

  @Prop({ enum: ['draft', 'scheduled', 'active', 'completed', 'evaluated'], default: 'draft' })
  status: string;

  @Prop({ default: 0 })
  totalAnswerSheets: number;
}

export const ExamSchema = SchemaFactory.createForClass(Exam);
