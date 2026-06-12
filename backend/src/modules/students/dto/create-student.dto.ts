import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

/** Parent info sub-DTO */
export class ParentInfoDto {
  @IsOptional() @IsString() fatherName?: string;
  @IsOptional() @IsString() motherName?: string;
  @IsOptional() @IsString() parentUserId?: string;
  @IsOptional() @IsString() contactPhone?: string;
  @IsOptional() @IsString() contactEmail?: string;
}

/**
 * DTO for creating a new student.
 */
export class CreateStudentDto {
  @IsString() @IsNotEmpty() userId!: string;
  @IsString() @IsNotEmpty() schoolId!: string;
  @IsString() @IsNotEmpty() rollNumber!: string;
  @IsString() @IsNotEmpty() admissionNumber!: string;
  @IsString() @IsNotEmpty() grade!: string;
  @IsString() @IsNotEmpty() section!: string;
  @IsOptional() @IsNumber() age?: number;
  @IsOptional() @IsString() gender?: string;
  @IsOptional() @IsDateString() dateOfBirth?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ParentInfoDto)
  parentInfo?: ParentInfoDto;
}
