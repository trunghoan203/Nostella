import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGreetingCardDto } from './dto/create-greeting-card.dto';
import { GreetingCard, User } from '@prisma/client';

type UserCheckResult = Pick<User, 'id' | 'fullName' | 'email'>;

@Injectable()
export class GreetingCardsService {
  constructor(private readonly prisma: PrismaService) {}

  async checkReceiverEmail(email: string): Promise<UserCheckResult> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, fullName: true, email: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async create(
    senderId: string,
    dto: CreateGreetingCardDto,
  ): Promise<GreetingCard> {
    const { receiverEmail, scheduledAt, ...rest } = dto;

    const receiver = await this.prisma.user.findUnique({
      where: { email: receiverEmail },
    });

    if (!receiver) {
      throw new BadRequestException('Receiver not found');
    }

    return this.prisma.greetingCard.create({
      data: {
        ...rest,
        senderId,
        receiverId: receiver.id,
        scheduledAt: new Date(scheduledAt),
      },
    });
  }

  async findAllReceived(userId: string) {
    const now = new Date();
    return this.prisma.greetingCard.findMany({
      where: {
        receiverId: userId,
        scheduledAt: { lte: now },
      },
      include: {
        sender: {
          select: { fullName: true, email: true },
        },
      },
      orderBy: { scheduledAt: 'desc' },
    });
  }

  // 4. Đếm chưa đọc
  async countUnread(userId: string): Promise<number> {
    const now = new Date();
    return this.prisma.greetingCard.count({
      where: {
        receiverId: userId,
        isRead: false,
        scheduledAt: { lte: now },
      },
    });
  }

  // 5. Đánh dấu đã đọc
  async markAsRead(userId: string, cardId: string): Promise<{ count: number }> {
    return this.prisma.greetingCard.updateMany({
      where: {
        id: cardId,
        receiverId: userId,
      },
      data: { isRead: true },
    });
  }
}
