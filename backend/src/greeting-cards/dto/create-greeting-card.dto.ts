import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateGreetingCardDto {
  @IsEmail({}, { message: 'Email người nhận không hợp lệ' })
  @IsNotEmpty()
  receiverEmail: string;

  @IsString()
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Lời chúc không được để trống' })
  message: string;

  @IsUrl({}, { message: 'URL hình ảnh không hợp lệ' })
  @IsNotEmpty()
  imageUrl: string;

  @IsDateString({}, { message: 'Ngày gửi không hợp lệ' })
  @IsNotEmpty()
  scheduledAt: string;
}
