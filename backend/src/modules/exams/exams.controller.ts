import { Controller, Get, Post, Put, Patch, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/constants/roles.enum';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { scopedSchool } from '../../common/utils/security.util';

@Controller('exams')
@UseGuards(JwtAuthGuard)
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.TEACHER)
  async create(@Body() data: Record<string, unknown>) {
    return this.examsService.create(data);
  }

  @Get()
  async findAll(
    @CurrentUser() user: any,
    @Query('page') page?: number, @Query('limit') limit?: number,
    @Query('school') school?: string, @Query('teacher') teacher?: string,
    @Query('grade') grade?: string, @Query('status') status?: string,
    @Query('type') type?: string,
  ) {
    return this.examsService.findAll({
      page, limit, teacher, grade, status, type,
      school: scopedSchool(user, school),
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.examsService.findById(id);
  }

  @Put(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.TEACHER)
  async update(@Param('id') id: string, @Body() updates: Record<string, unknown>) {
    return this.examsService.update(id, updates);
  }

  @Patch(':id/status')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.TEACHER)
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.examsService.updateStatus(id, status);
  }

  @Get(':id/stats')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.TEACHER)
  async getStats(@Param('id') id: string) {
    return this.examsService.getExamStats(id);
  }

  @Get(':id/answer-sheets')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.TEACHER)
  async getAnswerSheets(@Param('id') id: string, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.examsService.getAnswerSheets(id, { page, limit });
  }

  @Post(':id/answer-sheets')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.TEACHER)
  async createAnswerSheet(@Param('id') examId: string, @Body() data: Record<string, unknown>) {
    return this.examsService.createAnswerSheet({ ...data, exam: examId } as any);
  }
}
