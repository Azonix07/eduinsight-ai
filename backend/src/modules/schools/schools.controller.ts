import { Controller, Get, Post, Put, Delete, Param, Query, Body, UseGuards, ForbiddenException } from '@nestjs/common';
import { SchoolsService } from './schools.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../common/constants/roles.enum';
import { userSchoolId } from '../../common/utils/security.util';

@Controller('schools')
@UseGuards(JwtAuthGuard)
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  async create(@Body() data: Record<string, unknown>) {
    return this.schoolsService.create(data);
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN)
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number, @Query('search') search?: string) {
    return this.schoolsService.findAll({ page, limit, search });
  }

  @Get(':id')
  async findById(@Param('id') id: string, @CurrentUser() user: any) {
    // Members may read their own school; everything else is super-admin only.
    if (user.role !== UserRole.SUPER_ADMIN && userSchoolId(user) !== id) {
      throw new ForbiddenException('You can only view your own school');
    }
    return this.schoolsService.findById(id);
  }

  @Put(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  async update(@Param('id') id: string, @Body() updates: Record<string, unknown>) {
    return this.schoolsService.update(id, updates);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  async deactivate(@Param('id') id: string) {
    return this.schoolsService.deactivate(id);
  }
}
