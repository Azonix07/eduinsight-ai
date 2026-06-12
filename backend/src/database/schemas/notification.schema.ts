import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = NotificationModel & Document;

@Schema({ timestamps: true })
export class NotificationModel {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  user: Types.ObjectId;

  @Prop({ required: true, enum: ['performance', 'exam', 'improvement', 'alert', 'system'] })
  type: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ type: Object })
  data?: Record<string, unknown>;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ enum: ['in_app', 'email', 'both'], default: 'in_app' })
  sentVia: string;
}

export const NotificationSchema = SchemaFactory.createForClass(NotificationModel);
