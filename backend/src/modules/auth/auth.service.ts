import { Injectable, UnauthorizedException, BadRequestException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { User, UserDocument } from '../../database/schemas/user.schema';
import { School, SchoolDocument } from '../../database/schemas/school.schema';
import { RegisterDto, LoginDto, ResetPasswordDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(School.name) private schoolModel: Model<SchoolDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /** Register a new user */
  async register(dto: RegisterDto) {
    const existingUser = await this.userModel.findOne({ email: dto.email });
    if (existingUser) {
      throw new ConflictException('A user with this email already exists');
    }

    // If school code provided, validate it
    let schoolId = undefined;
    if (dto.schoolCode) {
      const school = await this.schoolModel.findOne({ code: dto.schoolCode.toUpperCase(), isActive: true });
      if (!school) throw new BadRequestException('Invalid school code');
      schoolId = school._id;
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);
    const emailVerificationToken = uuidv4();

    const user = await this.userModel.create({
      ...dto,
      password: hashedPassword,
      school: schoolId,
      emailVerificationToken,
    });

    this.logger.log(`User registered: ${user.email}`);

    return {
      message: 'Registration successful. Please verify your email.',
      userId: user._id,
    };
  }

  /** Login with email and password */
  async login(dto: LoginDto) {
    const user = await this.userModel
      .findOne({ email: dto.email, isActive: true })
      .select('+password +refreshTokens')
      .populate('school', 'name code');

    if (!user) throw new UnauthorizedException('Invalid email or password');

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid email or password');

    const tokens = await this.generateTokens(user._id.toString(), user.role);

    // Store refresh token
    user.refreshTokens = [...(user.refreshTokens || []).slice(-4), tokens.refreshToken];
    user.lastLogin = new Date();
    await user.save();

    return {
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
        school: user.school,
        isEmailVerified: user.isEmailVerified,
      },
      ...tokens,
    };
  }

  /** Refresh access token */
  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('jwt.refreshSecret'),
      });

      const user = await this.userModel.findById(payload.sub).select('+refreshTokens');
      if (!user || !user.refreshTokens?.includes(refreshToken)) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = await this.generateTokens(user._id.toString(), user.role);

      // Replace old refresh token
      user.refreshTokens = user.refreshTokens.filter((t: string) => t !== refreshToken);
      user.refreshTokens.push(tokens.refreshToken);
      await user.save();

      return tokens;
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  /** Forgot password — generate reset token */
  async forgotPassword(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      // Don't reveal whether the email exists
      return { message: 'If the email exists, a reset link has been sent.' };
    }

    const resetToken = uuidv4();
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    this.logger.log(`Password reset requested for: ${email}`);
    return { message: 'If the email exists, a reset link has been sent.' };
  }

  /** Reset password */
  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.userModel.findOne({
      passwordResetToken: dto.token,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) throw new BadRequestException('Invalid or expired reset token');

    user.password = await bcrypt.hash(dto.newPassword, 12);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.refreshTokens = [];
    await user.save();

    return { message: 'Password reset successful' };
  }

  /** Verify email */
  async verifyEmail(token: string) {
    const user = await this.userModel.findOne({ emailVerificationToken: token });
    if (!user) throw new BadRequestException('Invalid verification token');

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    return { message: 'Email verified successfully' };
  }

  /** Logout */
  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      await this.userModel.findByIdAndUpdate(userId, {
        $pull: { refreshTokens: refreshToken },
      });
    }
    return { message: 'Logged out successfully' };
  }

  /** Get user profile */
  async getProfile(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .populate('school', 'name code');
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }

  /** Validate user for JWT strategy */
  async validateUser(userId: string) {
    const user = await this.userModel.findById(userId).populate('school', 'name code');
    if (!user || !user.isActive) return null;
    return user;
  }

  /** Validate email/password for the local (passport-local) strategy */
  async validateCredentials(email: string, password: string) {
    const user = await this.userModel
      .findOne({ email, isActive: true })
      .select('+password')
      .populate('school', 'name code');
    if (!user) return null;
    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid ? user : null;
  }

  /** Generate access and refresh tokens */
  private async generateTokens(userId: string, role: string) {
    const payload = { sub: userId, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('jwt.secret'),
        expiresIn: this.configService.get('jwt.expiration'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('jwt.refreshSecret'),
        expiresIn: this.configService.get('jwt.refreshExpiration'),
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
