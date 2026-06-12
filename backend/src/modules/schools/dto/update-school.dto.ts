import { IsString, IsEmail, IsOptional, ValidateNested, IsObject, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto, SchoolSettingsDto } from './create-school.dto.js';

/**
 * DTO for updating a school.
 */
export class UpdateSchoolDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsEmail() contactEmail?: string;
  @IsOptional() @IsString() contactPhone?: string;
  @IsOptional() @IsString() logo?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;

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
}
