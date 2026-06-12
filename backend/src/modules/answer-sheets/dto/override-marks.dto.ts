import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class OverrideMarksDto {
  @IsInt()
  questionNumber: number;

  @IsNumber()
  @Min(0)
  marksAwarded: number;

  @IsOptional()
  @IsString()
  reason?: string;
}
