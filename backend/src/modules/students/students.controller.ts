import { Controller, Get, Post, Put, Param, Query, Body, UseGuards } from '@nestjs/common';
import { StudentsService } from './students.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/constants/roles.enum';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { scopedSchool } from '../../common/utils/security.util';

@Controller('students')
@UseGuards(JwtAuthGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.TEACHER)
  async create(@Body() data: Record<string, unknown>) {
    return this.studentsService.create(data);
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.TEACHER)
  async findAll(
    @CurrentUser() user: any,
    @Query('page') page?: number, @Query('limit') limit?: number,
    @Query('school') school?: string, @Query('grade') grade?: string,
    @Query('section') section?: string, @Query('search') search?: string,
  ) {
    return this.studentsService.findAll({
      page, limit, grade, section, search,
      school: scopedSchool(user, school),
    });
  }

  @Get('me')
  async getMyProfile(@CurrentUser() user: any) {
    return this.studentsService.findByUser(user._id);
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.TEACHER)
  async findById(@Param('id') id: string) {
    return this.studentsService.findById(id);
  }

  @Put(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.TEACHER)
  async update(@Param('id') id: string, @Body() updates: Record<string, unknown>) {
    return this.studentsService.update(id, updates);
  }
}
