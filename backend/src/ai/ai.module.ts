import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { AuthModule } from '../auth/auth.module';
import { AuthGuard } from '../auth/auth.guard';

@Module({
  imports: [AuthModule],
  providers: [AiService, AuthGuard],
  controllers: [AiController],
})
export class AiModule {}
