import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TeacherDocument = Teacher & Document;

@Schema({ timestamps: true })
export class Teacher {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'School', required: true, index: true })
  school: Types.ObjectId;

  @Prop()
  employeeId?: string;

  @Prop()
  department?: string;

  @Prop({ type: [Types.ObjectId], ref: 'Subject', default: [] })
  subjects: Types.ObjectId[];

  @Prop({ type: [String], default: [] })
  grades: string[];

  @Prop()
  qualification?: string;

  @Prop()
  experience?: number;

  @Prop({ type: [String], default: [] })
  specializations: string[];

  @Prop({ default: true })
  isActive: boolean;
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);
