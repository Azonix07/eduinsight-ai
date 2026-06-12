import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnswerSheetsController } from './answer-sheets.controller';
import { AnswerSheetsService } from './answer-sheets.service';
import { AnswerSheet, AnswerSheetSchema } from '../../database/schemas/answer-sheet.schema';
import { Exam, ExamSchema } from '../../database/schemas/exam.schema';
import { Student, StudentSchema } from '../../database/schemas/student.schema';
import { AiModule } from '../ai/ai.module';
import { UploadsModule } from '../uploads/uploads.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AnswerSheet.name, schema: AnswerSheetSchema },
      { name: Exam.name, schema: ExamSchema },
      { name: Student.name, schema: StudentSchema },
    ]),
    AiModule,
    UploadsModule,
  ],
  controllers: [AnswerSheetsController],
  providers: [AnswerSheetsService],
  exports: [AnswerSheetsService],
})
export class AnswerSheetsModule {}
