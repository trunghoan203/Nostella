import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as streamifier from 'streamifier';

interface MulterFile {
  buffer: Buffer;
  originalname?: string;
  mimetype?: string;
}

@Injectable()
export class StorageService {
  async uploadImage(file: MulterFile): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'nostella_memories',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            return reject(
              new Error(error.message || 'Cloudinary upload error'),
            );
          }

          if (!result) {
            return reject(new Error('Cloudinary upload failed'));
          }

          resolve(result);
        },
      );

      if (!file.buffer) {
        return reject(new Error('File content is invalid (missing buffer)'));
      }

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
