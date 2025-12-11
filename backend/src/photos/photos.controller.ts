import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Request,
  Body,
  Param,
  InternalServerErrorException,
  Get,
  Patch,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PhotosService } from './photos.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreatePhotoDto } from './dto/create-photo.dto';

interface RequestWithUser {
  user: { sub: string; email: string };
}

@Controller('photos')
@UseGuards(AuthGuard)
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadPhoto(
    @Request() req: RequestWithUser,
    @Body() dto: CreatePhotoDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 50 * 1024 * 1024 }),
          new FileTypeValidator({
            fileType: /^image\/(jpeg|jpg|png)$/i,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new InternalServerErrorException('File is missing');
    }

    const userId = req.user.sub;
    return this.photosService.uploadAndSave(
      userId,
      file,
      dto.caption,
      dto.takenAt,
      dto.description,
    );
  }

  @Get()
  getAllPhotos(@Request() req: RequestWithUser) {
    return this.photosService.findAllByUser(req.user.sub);
  }

  @Patch(':id')
  updatePhoto(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() body: { caption?: string; takenAt?: string; description?: string },
  ) {
    return this.photosService.updatePhoto(req.user.sub, id, body);
  }

  @Delete(':id')
  async deletePhoto(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.photosService.deletePhoto(req.user.sub, id);
  }

  @Post(':id/favorite')
  async toggleFavorite(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
  ) {
    return this.photosService.toggleFavorite(req.user.sub, id);
  }
}
