import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service.js';
import { UserDocument } from '../../../database/schemas/user.schema.js';

/**
 * Passport strategy for local (email/password) authentication.
 * Uses email as the username field.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  /**
   * Validates the user's email and password.
   * @param email - The user's email address
   * @param password - The user's password
   * @returns The validated user document
   * @throws UnauthorizedException if credentials are invalid
   */
  async validate(email: string, password: string): Promise<UserDocument> {
    const user = await this.authService.validateCredentials(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return user;
  }
}
