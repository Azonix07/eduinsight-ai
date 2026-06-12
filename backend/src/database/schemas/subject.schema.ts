import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SubjectDocument = Subject & Document;

@Schema({ timestamps: true })
export class Subject {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, uppercase: true, trim: true })
  code: string;

  @Prop({ type: Types.ObjectId, ref: 'School', required: true, index: true })
  school: Types.ObjectId;

  @Prop({ required: true })
  grade: string;

  @Prop({ enum: ['core', 'elective', 'language', 'custom'], default: 'core' })
  category: string;

  @Prop({ type: Types.ObjectId, ref: 'Teacher' })
  teacher?: Types.ObjectId;

  @Prop({ type: [Object], default: [] })
  syllabus: Array<{ unit: string; topics: string[]; weightage: number }>;

  @Prop({ default: true })
  isActive: boolean;
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);
