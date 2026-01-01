import { Module } from '@nestjs/common';
import { GreetingCardsService } from './greeting-cards.service';
import { GreetingCardsController } from './greeting-cards.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, AuthModule, ConfigModule],
  controllers: [GreetingCardsController],
  providers: [GreetingCardsService],
})
export class GreetingCardsModule {}
