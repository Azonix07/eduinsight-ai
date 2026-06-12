import { IsString, IsOptional, IsNumber, IsDateString, ValidateNested, IsObject, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ParentInfoDto } from './create-student.dto.js';

/**
 * DTO for updating a student.
 */
export class UpdateStudentDto {
  @IsOptional() @IsString() rollNumber?: string;
  @IsOptional() @IsString() admissionNumber?: string;
  @IsOptional() @IsString() grade?: string;
  @IsOptional() @IsString() section?: string;
  @IsOptional() @IsNumber() age?: number;
  @IsOptional() @IsString() gender?: string;
  @IsOptional() @IsDateString() dateOfBirth?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ParentInfoDto)
  parentInfo?: ParentInfoDto;
}
