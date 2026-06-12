import { Controller, Post, Body, UseGuards, Get, Query } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/constants/roles.enum';
import { EVALUATION_PROMPT, ANALYSIS_PROMPT, PREDICTION_PROMPT, IMPROVEMENT_PROMPT, CHAT_SYSTEM_PROMPT } from './prompts/prompts';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  /** Evaluate answers against marking scheme */
  @Post('evaluate')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.TEACHER)
  async evaluate(@Body() body: { markingScheme: string; studentAnswers: string }) {
    const prompt = EVALUATION_PROMPT
      .replace('{markingScheme}', body.markingScheme)
      .replace('{studentAnswers}', body.studentAnswers);

    const result = await this.aiService.complete(
      'You are an expert academic evaluator. Respond only in valid JSON.',
      prompt,
    );

    try {
      return JSON.parse(result);
    } catch {
      return { raw: result };
    }
  }

  /** Analyze student performance */
  @Post('analyze')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.TEACHER)
  async analyze(@Body() body: { evaluationResults: string; studentHistory: string }) {
    const prompt = ANALYSIS_PROMPT
      .replace('{evaluationResults}', body.evaluationResults)
      .replace('{studentHistory}', body.studentHistory);

    const result = await this.aiService.complete(
      'You are an educational psychologist. Respond only in valid JSON.',
      prompt,
    );

    try {
      return JSON.parse(result);
    } catch {
      return { raw: result };
    }
  }

  /** Predict student performance */
  @Post('predict')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.TEACHER)
  async predict(@Body() body: { performanceHistory: string; currentAnalysis: string }) {
    const prompt = PREDICTION_PROMPT
      .replace('{performanceHistory}', body.performanceHistory)
      .replace('{currentAnalysis}', body.currentAnalysis);

    const result = await this.aiService.complete(
      'You are an educational data analyst. Respond only in valid JSON.',
      prompt,
    );

    try {
      return JSON.parse(result);
    } catch {
      return { raw: result };
    }
  }

  /** Generate improvement plan */
  @Post('improve')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.TEACHER)
  async improve(@Body() body: { studentAnalysis: string; weakAreas: string }) {
    const prompt = IMPROVEMENT_PROMPT
      .replace('{studentAnalysis}', body.studentAnalysis)
      .replace('{weakAreas}', body.weakAreas);

    const result = await this.aiService.complete(
      'You are an educational planning expert. Respond only in valid JSON.',
      prompt,
    );

    try {
      return JSON.parse(result);
    } catch {
      return { raw: result };
    }
  }

  /** AI Chat */
  @Post('chat')
  async chat(
    @CurrentUser() user: any,
    @Body() body: { message: string; history?: Array<{ role: 'user' | 'assistant'; content: string }> },
  ) {
    const systemPrompt = CHAT_SYSTEM_PROMPT
      .replace('{studentName}', `${user.firstName} ${user.lastName}`)
      .replace('{grade}', 'N/A')
      .replace('{recentPerformance}', 'N/A');

    const messages = [
      ...(body.history || []),
      { role: 'user' as const, content: body.message },
    ];

    const reply = await this.aiService.chat(systemPrompt, messages);
    return { reply };
  }
}
