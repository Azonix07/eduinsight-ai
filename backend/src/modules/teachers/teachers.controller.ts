import { Controller, Get, Post, Put, Param, Query, Body, UseGuards } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/constants/roles.enum';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { scopedSchool } from '../../common/utils/security.util';

@Controller('teachers')
@UseGuards(JwtAuthGuard)
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  async create(@Body() data: Record<string, unknown>) {
    return this.teachersService.create(data);
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.TEACHER)
  async findAll(
    @CurrentUser() user: any,
    @Query('page') page?: number, @Query('limit') limit?: number,
    @Query('school') school?: string, @Query('department') department?: string,
  ) {
    return this.teachersService.findAll({
      page, limit, department,
      school: scopedSchool(user, school),
    });
  }

  @Get('me')
  async getMyProfile(@CurrentUser() user: any) {
    return this.teachersService.findByUser(user._id);
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.TEACHER)
  async findById(@Param('id') id: string) {
    return this.teachersService.findById(id);
  }

  @Put(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  async update(@Param('id') id: string, @Body() updates: Record<string, unknown>) {
    return this.teachersService.update(id, updates);
  }
}
