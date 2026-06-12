import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Query,
  Body,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AnswerSheetsService, UploadFile } from './answer-sheets.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../common/constants/roles.enum';
import { scopedSchool } from '../../common/utils/security.util';
import { UploadAnswerSheetDto } from './dto/upload-answer-sheet.dto';
import { OverrideMarksDto } from './dto/override-marks.dto';

@Controller('answer-sheets')
@UseGuards(JwtAuthGuard)
export class AnswerSheetsController {
  constructor(private readonly answerSheetsService: AnswerSheetsService) {}

  /** Upload one or more answer-sheet images; runs OCR and creates the record. */
  @Post('upload')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.TEACHER)
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      limits: { fileSize: 15 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (allowed.includes(file.mimetype)) cb(null, true);
        else cb(new BadRequestException('Only JPEG, PNG, WebP, or GIF images are accepted'), false);
      },
    }),
  )
  async upload(
    @UploadedFiles() files: UploadFile[],
    @Body() dto: UploadAnswerSheetDto,
    @CurrentUser() user: { _id: string },
  ) {
    return this.answerSheetsService.uploadAndExtract(dto.examId, dto.studentId, files, String(user._id));
  }

  /** Evaluate an uploaded answer sheet against the exam marking scheme. */
  @Post(':id/evaluate')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.TEACHER)
  async evaluate(@Param('id') id: string) {
    return this.answerSheetsService.evaluate(id);
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.TEACHER)
  async findAll(
    @CurrentUser() user: any,
    @Query('exam') exam?: string,
    @Query('student') student?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.answerSheetsService.findAll({
      exam, student, page, limit,
      school: scopedSchool(user, undefined),
    });
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.TEACHER)
  async findOne(@Param('id') id: string) {
    return this.answerSheetsService.findOne(id);
  }

  /** Override a question's marks (teacher review). */
  @Patch(':id/override')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.TEACHER)
  async override(
    @Param('id') id: string,
    @Body() dto: OverrideMarksDto,
    @CurrentUser() user: { _id: string },
  ) {
    return this.answerSheetsService.overrideQuestion(
      id,
      dto.questionNumber,
      dto.marksAwarded,
      dto.reason ?? '',
      String(user._id),
    );
  }
}
