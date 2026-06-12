import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type StudentDocument = Student & Document;

@Schema({ timestamps: true })
export class Student {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'School', required: true, index: true })
  school: Types.ObjectId;

  @Prop({ required: true })
  rollNumber: string;

  @Prop()
  admissionNumber?: string;

  @Prop({ required: true, index: true })
  grade: string;

  @Prop({ required: true, index: true })
  section: string;

  @Prop()
  age?: number;

  @Prop({ enum: ['male', 'female', 'other'] })
  gender?: string;

  @Prop()
  dateOfBirth?: Date;

  @Prop({ type: Object, default: {} })
  parentInfo: {
    fatherName?: string;
    motherName?: string;
    parentUser?: Types.ObjectId;
    contactPhone?: string;
    contactEmail?: string;
  };

  @Prop({ type: [Object], default: [] })
  academicHistory: Array<{ year: string; grade: string; percentage: number; rank?: number }>;

  @Prop({ type: [Object], default: [] })
  performanceHistory: Array<{ examId: Types.ObjectId; subjectId: Types.ObjectId; marks: number; maxMarks: number; date: Date }>;

  @Prop({ default: true })
  isActive: boolean;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
StudentSchema.index({ school: 1, grade: 1, section: 1 });
