import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private client: Anthropic | null = null;
  private model: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('claude.apiKey');
    this.model = this.configService.get<string>('claude.model') || 'claude-sonnet-4-20250514';

    if (apiKey) {
      this.client = new Anthropic({ apiKey });
      this.logger.log('Claude AI client initialized');
    } else {
      this.logger.warn('Claude API key not configured — AI features will return mock data');
    }
  }

  /** Send a prompt to Claude and get a response */
  async complete(systemPrompt: string, userMessage: string): Promise<string> {
    if (!this.client) {
      return this.getMockResponse(userMessage);
    }

    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      });

      const textBlock = response.content.find((block) => block.type === 'text');
      return textBlock ? textBlock.text : '';
    } catch (error) {
      this.logger.error('Claude API error', error);
      return this.getMockResponse(userMessage);
    }
  }

  /** Send a chat message with conversation history */
  async chat(
    systemPrompt: string,
    messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  ): Promise<string> {
    if (!this.client) {
      return 'I\'m currently in demo mode. In production, I would provide personalized insights about your academic performance. How can I help you study better today?';
    }

    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 2048,
        system: systemPrompt,
        messages,
      });

      const textBlock = response.content.find((block) => block.type === 'text');
      return textBlock ? textBlock.text : '';
    } catch (error) {
      this.logger.error('Claude chat error', error);
      return 'I apologize, but I\'m experiencing technical difficulties. Please try again.';
    }
  }

  /** Analyze an image (for OCR) using Claude's vision */
  async analyzeImage(imageBase64: string, prompt: string, mediaType = 'image/jpeg'): Promise<string> {
    if (!this.client) {
      return JSON.stringify({
        extractedText: 'Demo: This is mock OCR output. Configure Claude API key for real OCR.',
        structuredContent: [
          { questionNumber: 1, answerText: 'Sample answer for question 1', hasDiagrams: false, hasEquations: false, confidence: 0.85 },
          { questionNumber: 2, answerText: 'Sample answer for question 2', hasDiagrams: false, hasEquations: true, confidence: 0.90 },
        ],
      });
    }

    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType as 'image/jpeg', data: imageBase64 } },
            { type: 'text', text: prompt },
          ],
        }],
      });

      const textBlock = response.content.find((block) => block.type === 'text');
      return textBlock ? textBlock.text : '';
    } catch (error) {
      this.logger.error('Claude vision error', error);
      return '';
    }
  }

  /** Generate mock response for demo mode */
  private getMockResponse(userMessage: string): string {
    return JSON.stringify({
      questionResults: [
        { questionNumber: 1, marksAwarded: 8, maxMarks: 10, feedback: 'Good understanding of core concepts. Minor errors in explanation.', improvementSuggestion: 'Add more specific examples.', errors: [{ type: 'incomplete', description: 'Answer could be more detailed' }] },
        { questionNumber: 2, marksAwarded: 7, maxMarks: 10, feedback: 'Correct approach but calculation error in step 3.', improvementSuggestion: 'Double-check calculations.', errors: [{ type: 'calculation', description: 'Arithmetic error in step 3' }] },
      ],
      totalMarks: 15,
      overallFeedback: 'Good overall performance. Focus on detailed explanations and calculation accuracy.',
    });
  }
}
