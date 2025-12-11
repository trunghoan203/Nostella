import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
  ) {}

  async findOneByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { id } }) as Promise<User>;
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async updateUser(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async updateProfile(userId: string, fullName: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { fullName },
      select: {
        id: true,
        email: true,
        fullName: true,
        createdAt: true,
      },
    });
  }

  async updateAvatar(userId: string, file: Express.Multer.File) {
    const uploadResult = await this.storageService.uploadImage(file);

    return this.prisma.user.update({
      where: { id: userId },
      data: { avatar: uploadResult.secure_url },
    });
  }
}
