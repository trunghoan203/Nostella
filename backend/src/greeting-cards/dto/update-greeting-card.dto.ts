import { PartialType } from '@nestjs/mapped-types';
import { CreateGreetingCardDto } from './create-greeting-card.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateGreetingCardDto extends PartialType(CreateGreetingCardDto) {
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;
}
