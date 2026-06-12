import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * DTO for forgot password request.
 */
export class ForgotPasswordDto {
  /** Email address of the account to reset */
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;
}
