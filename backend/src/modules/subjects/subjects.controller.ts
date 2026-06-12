import { Controller, Get, Post, Put, Param, Query, Body, UseGuards } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/constants/roles.enum';

@Controller('subjects')
@UseGuards(JwtAuthGuard)
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  async create(@Body() data: Record<string, unknown>) {
    return this.subjectsService.create(data);
  }

  @Get()
  async findAll(
    @Query('page') page?: number, @Query('limit') limit?: number,
    @Query('school') school?: string, @Query('grade') grade?: string,
    @Query('category') category?: string,
  ) {
    return this.subjectsService.findAll({ page, limit, school, grade, category });
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.subjectsService.findById(id);
  }

  @Put(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  async update(@Param('id') id: string, @Body() updates: Record<string, unknown>) {
    return this.subjectsService.update(id, updates);
  }
}
