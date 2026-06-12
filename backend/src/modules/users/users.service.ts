import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../../database/schemas/user.schema';
import { UserRole } from '../../common/constants/roles.enum';
import { escapeRegex } from '../../common/utils/security.util';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  /** Find all users with pagination and optional filters */
  async findAll(query: {
    page?: number;
    limit?: number;
    role?: string;
    school?: string;
    search?: string;
    isActive?: boolean;
  }) {
    const { page = 1, limit = 20, role, school, search, isActive } = query;
    const filter: Record<string, unknown> = {};

    if (role) filter.role = role;
    if (school) filter.school = new Types.ObjectId(school);
    if (isActive !== undefined) filter.isActive = isActive;
    if (search) {
      const safe = escapeRegex(search);
      filter.$or = [
        { firstName: { $regex: safe, $options: 'i' } },
        { lastName: { $regex: safe, $options: 'i' } },
        { email: { $regex: safe, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      this.userModel
        .find(filter)
        .populate('school', 'name code')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 }),
      this.userModel.countDocuments(filter),
    ]);

    return { users, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  /** Find user by ID */
  async findById(id: string) {
    const user = await this.userModel.findById(id).populate('school', 'name code');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /** Fields an admin may edit on another user. Credentials and tokens are never mass-assignable. */
  private static readonly UPDATABLE_FIELDS = ['firstName', 'lastName', 'avatar', 'isActive', 'school'] as const;

  /** Update user — whitelisted fields only; role changes require super admin. */
  async update(id: string, updates: Record<string, unknown>, requesterRole?: string) {
    const safe: Record<string, unknown> = {};
    for (const field of UsersService.UPDATABLE_FIELDS) {
      if (updates[field] !== undefined) safe[field] = updates[field];
    }

    if (updates.role !== undefined) {
      if (requesterRole !== UserRole.SUPER_ADMIN) {
        throw new ForbiddenException('Only a super admin can change user roles');
      }
      safe.role = updates.role;
    }

    const user = await this.userModel
      .findByIdAndUpdate(id, { $set: safe }, { new: true, runValidators: true })
      .populate('school', 'name code');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /** Soft-delete user */
  async deactivate(id: string) {
    const user = await this.userModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!user) throw new NotFoundException('User not found');
    return { message: 'User deactivated' };
  }
}
