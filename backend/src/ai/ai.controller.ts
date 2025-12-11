import { Controller, Post, Param, UseGuards, Request } from '@nestjs/common';
import { AiService } from './ai.service';
import { AuthGuard } from '../auth/auth.guard';

interface RequestWithUser {
  user: { sub: string; email: string };
}

@UseGuards(AuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate/:photoId')
  async generateStory(
    @Request() req: RequestWithUser,
    @Param('photoId') photoId: string,
  ) {
    return this.aiService.generateStory(req.user.sub, photoId);
  }
}
