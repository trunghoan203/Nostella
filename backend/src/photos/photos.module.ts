import { Module } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { PhotosController } from './photos.controller';
import { StorageModule } from '../storage/storage.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [StorageModule, PrismaModule, AuthModule],
  controllers: [PhotosController],
  providers: [PhotosService],
})
export class PhotosModule {}
