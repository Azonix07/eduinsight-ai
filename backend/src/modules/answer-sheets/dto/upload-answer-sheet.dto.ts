import { IsNotEmpty, IsString } from 'class-validator';

export class UploadAnswerSheetDto {
  @IsString()
  @IsNotEmpty()
  examId: string;

  @IsString()
  @IsNotEmpty()
  studentId: string;
}
