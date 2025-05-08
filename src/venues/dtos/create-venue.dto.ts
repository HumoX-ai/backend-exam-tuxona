import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray, Min, IsNotEmpty } from 'class-validator';

export class CreateVenueDto {
  @ApiProperty({
    description: 'To‘yxona nomi',
    example: 'Navruz Saroyi',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'To‘yxona rasmlari URL manzillari',
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({
    description: 'To‘yxona joylashgan tuman',
    example: 'Chilonzor',
  })
  @IsString()
  @IsNotEmpty()
  district: string;

  @ApiProperty({
    description: 'To‘yxona manzili',
    example: 'Chilonzor ko‘chasi, 45-uy',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'To‘yxona sig‘imi (odamlar soni)',
    example: 200,
  })
  @IsNumber()
  @Min(1)
  capacity: number;

  @ApiProperty({
    description: 'Bir kishi uchun narx (so‘m)',
    example: 50000,
  })
  @IsNumber()
  @Min(0)
  pricePerSeat: number;

  @ApiProperty({
    description: 'To‘yxona telefon raqami',
    example: '+998901234567',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'To‘yxona egasi (foydalanuvchi ID)',
    example: '60c72b2f9b1e8c001c8b4567',
  })
  @IsString()
  @IsNotEmpty()
  owner: string;
}
