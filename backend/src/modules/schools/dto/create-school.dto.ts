import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

/** Address sub-DTO */
export class AddressDto {
  @IsOptional() @IsString() street?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() state?: string;
  @IsOptional() @IsString() zipCode?: string;
  @IsOptional() @IsString() country?: string;
}

/** Settings sub-DTO */
export class SchoolSettingsDto {
  @IsOptional() @IsString() academicYear?: string;
  @IsOptional() @IsString() gradingSystem?: string;
  @IsOptional() @IsString() timezone?: string;
}

/**
 * DTO for creating a new school.
 */
export class CreateSchoolDto {
  @IsString()
  @IsNotEmpty({ message: 'School name is required' })
  name!: string;

  @IsString()
  @IsNotEmpty({ message: 'School code is required' })
  code!: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Contact email is required' })
  contactEmail!: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => SchoolSettingsDto)
  settings?: SchoolSettingsDto;

  @IsOptional()
  @IsString()
  logo?: string;
}
