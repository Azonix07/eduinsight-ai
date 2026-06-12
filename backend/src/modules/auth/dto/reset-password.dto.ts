import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

/**
 * DTO for resetting a password using a reset token.
 */
export class ResetPasswordDto {
  /** The password reset token received via email */
  @IsString()
  @IsNotEmpty({ message: 'Reset token is required' })
  token!: string;

  /** New password with strong password requirements */
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  newPassword!: string;
}
