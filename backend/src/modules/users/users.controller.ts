import { Controller, Get, Put, Delete, Param, Query, Body, UseGuards, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../common/constants/roles.enum';
import { scopedSchool } from '../../common/utils/security.util';

const ADMIN_ROLES: string[] = [UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN];

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  async findAll(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('role') role?: string,
    @Query('school') school?: string,
    @Query('search') search?: string,
  ) {
    return this.usersService.findAll({
      page,
      limit,
      role,
      school: scopedSchool(user, school),
      search,
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string, @CurrentUser() user: any) {
    // Users may read their own profile; anything else requires an admin role.
    if (String(user._id) !== id && !ADMIN_ROLES.includes(user.role)) {
      throw new ForbiddenException('You can only view your own profile');
    }
    return this.usersService.findById(id);
  }

  @Put(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updates: Record<string, unknown>,
    @CurrentUser() user: any,
  ) {
    return this.usersService.update(id, updates, user.role);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  async deactivate(@Param('id') id: string) {
    return this.usersService.deactivate(id);
  }
}
