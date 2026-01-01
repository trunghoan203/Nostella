import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { GreetingCardsService } from './greeting-cards.service';
import { CreateGreetingCardDto } from './dto/create-greeting-card.dto';
import { AuthGuard } from '../auth/auth.guard';
import { GreetingCard, User } from '@prisma/client';

interface RequestWithUser extends Request {
  user: {
    sub: string;
    email: string;
  };
}

type UserCheckResult = Pick<User, 'id' | 'fullName' | 'email'>;

@UseGuards(AuthGuard)
@Controller('greeting-cards')
export class GreetingCardsController {
  constructor(private readonly greetingCardsService: GreetingCardsService) {}

  @Get('check-user')
  async checkUser(@Query('email') email: string): Promise<UserCheckResult> {
    return this.greetingCardsService.checkReceiverEmail(email);
  }

  @Post()
  async create(
    @Request() req: RequestWithUser,
    @Body() createGreetingCardDto: CreateGreetingCardDto,
  ): Promise<GreetingCard> {
    return this.greetingCardsService.create(
      req.user.sub,
      createGreetingCardDto,
    );
  }

  @Get()
  async findAllReceived(@Request() req: RequestWithUser) {
    return this.greetingCardsService.findAllReceived(req.user.sub);
  }

  @Get('unread-count')
  async countUnread(
    @Request() req: RequestWithUser,
  ): Promise<{ count: number }> {
    const count = await this.greetingCardsService.countUnread(req.user.sub);
    return { count };
  }

  @Patch(':id/read')
  async markAsRead(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
  ): Promise<{ count: number }> {
    return this.greetingCardsService.markAsRead(req.user.sub, id);
  }
}
