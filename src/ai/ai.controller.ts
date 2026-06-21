import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate-plan')
  async generatePlan(@Body() body: { story: string }) {
    console.log('Prompt from frontend:', body.story);

    const result = await this.aiService.generatePlan(body.story);

    console.log('LLM result:', result);

    return result;
  }
}