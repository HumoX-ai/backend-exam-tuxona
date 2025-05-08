import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsArray,
  IsEnum,
  Min,
  IsOptional,
} from 'class-validator';

export class UpdateVenueDto {
  @ApiProperty({
    description: 'To‘yxona nomi',
    example: 'Navruz Saroyi',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'To‘yxona rasmlari URL manzillari',
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({
    description: 'To‘yxona joylashgan tuman',
    example: 'Chilonzor',
    required: false,
  })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiProperty({
    description: 'To‘yxona manzili',
    example: 'Chilonzor ko‘chasi, 45-uy',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'To‘yxona sig‘imi (odamlar soni)',
    example: 200,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  capacity?: number;

  @ApiProperty({
    description: 'Bir kishi uchun narx (so‘m)',
    example: 50000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  pricePerSeat?: number;

  @ApiProperty({
    description: 'To‘yxona telefon raqami',
    example: '+998901234567',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'To‘yxona holati (pending yoki approved)',
    example: 'approved',
    required: false,
  })
  @IsOptional()
  @IsEnum(['pending', 'approved'])
  status?: string;
}
