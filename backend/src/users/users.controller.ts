import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';

interface RequestWithUser {
  user: { sub: string; email: string };
}

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  getProfile(@Request() req: RequestWithUser) {
    return this.usersService.findOneByEmail(req.user.email);
  }

  @Patch('profile')
  async updateProfile(
    @Request() req: RequestWithUser,
    @Body() body: { name: string },
  ) {
    return this.usersService.updateProfile(req.user.sub, body.name);
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatar(
    @Request() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.updateAvatar(req.user.sub, file);
  }
}
