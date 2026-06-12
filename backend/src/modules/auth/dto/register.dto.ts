import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { UserRole } from '../../../common/constants/roles.enum.js';

/**
 * DTO for user registration.
 */
export class RegisterDto {
  /** User's email address */
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  /**
   * Password must be at least 8 characters and contain
   * at least one uppercase, one lowercase, one number, and one special character.
   */
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  password!: string;

  /** User's first name */
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  firstName!: string;

  /** User's last name */
  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  lastName!: string;

  /** Role of the user in the platform */
  @IsEnum(UserRole, { message: 'Invalid role specified' })
  role!: UserRole;

  /** Optional school code (required for school_admin, teacher, student, parent) */
  @IsOptional()
  @IsString()
  schoolCode?: string;
}
