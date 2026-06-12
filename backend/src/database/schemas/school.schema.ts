import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SchoolDocument = School & Document;

@Schema({ timestamps: true })
export class School {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, uppercase: true, trim: true, index: true })
  code: string;

  @Prop({ type: Object, default: {} })
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zip: string;
  };

  @Prop()
  contactEmail?: string;

  @Prop()
  contactPhone?: string;

  @Prop()
  logo?: string;

  @Prop({
    type: Object,
    default: { academicYear: '2025-2026', gradingSystem: 'percentage', timezone: 'Asia/Kolkata' },
  })
  settings: {
    academicYear: string;
    gradingSystem: string;
    timezone: string;
  };

  @Prop({
    type: Object,
    default: { plan: 'starter', status: 'trial', expiresAt: null },
  })
  subscription: {
    plan: string;
    status: string;
    expiresAt?: Date;
  };

  @Prop({ default: true })
  isActive: boolean;
}

export const SchoolSchema = SchemaFactory.createForClass(School);
