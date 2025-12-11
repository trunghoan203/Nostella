import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { Photo } from '@prisma/client';
import { UploadApiResponse } from 'cloudinary';

export interface BufferedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Injectable()
export class PhotosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async uploadAndSave(
    userId: string,
    file: BufferedFile,
    caption?: string,
    takenAt?: string,
    description?: string,
  ): Promise<Photo> {
    const uploadResult = await this.storageService.uploadImage({
      buffer: file.buffer,
      originalname: file.originalname,
      mimetype: file.mimetype,
    });

    const result = uploadResult as UploadApiResponse;

    if (!result.secure_url) {
      throw new BadRequestException('Upload failed');
    }

    return this.prisma.photo.create({
      data: {
        userId,
        url: result.secure_url,
        key: result.public_id,
        caption: caption || '',
        takenAt: takenAt ? new Date(takenAt) : undefined,
        description: description || null,
      },
    });
  }

  async findAllByUser(userId: string) {
    return this.prisma.photo.findMany({
      where: { userId },
      orderBy: { takenAt: 'desc' },
    });
  }

  async updatePhoto(
    userId: string,
    photoId: string,
    data: { caption?: string; takenAt?: string; description?: string },
  ) {
    const photo = await this.prisma.photo.findUnique({
      where: { id: photoId },
    });

    if (!photo) throw new NotFoundException('Photo not found');
    if (photo.userId !== userId) throw new ForbiddenException();

    return this.prisma.photo.update({
      where: { id: photoId },
      data: {
        ...(data.caption !== undefined && { caption: data.caption }),
        ...(data.takenAt !== undefined && { takenAt: new Date(data.takenAt) }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
      },
    });
  }

  async deletePhoto(userId: string, photoId: string) {
    const photo = await this.prisma.photo.findUnique({
      where: { id: photoId },
    });

    if (!photo) throw new NotFoundException('Photo not found');
    if (photo.userId !== userId)
      throw new ForbiddenException('You do not own this photo');

    return this.prisma.photo.delete({
      where: { id: photoId },
    });
  }

  async toggleFavorite(userId: string, photoId: string) {
    const photo = await this.prisma.photo.findUnique({
      where: { id: photoId },
    });

    if (!photo) {
      throw new NotFoundException('Photo not found');
    }

    if (photo.userId !== userId) {
      throw new ForbiddenException('You do not own this photo');
    }

    return this.prisma.photo.update({
      where: { id: photoId },
      data: {
        isFavorite: !photo.isFavorite,
      },
    });
  }
}
