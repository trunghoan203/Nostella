import { IsString, IsOptional } from 'class-validator';

export class CreatePhotoDto {
  @IsString()
  caption: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  takenAt?: string;
}
