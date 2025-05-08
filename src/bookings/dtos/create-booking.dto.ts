import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsDateString,
  IsNotEmpty,
  Min,
} from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({
    description: 'Bron qilingan to‘yxona IDsi',
    example: '60c72b2f9b1e8c001c8b4567',
  })
  @IsString()
  @IsNotEmpty()
  venue: string;

  @ApiProperty({
    description: 'Bron qilinadigan sana (YYYY-MM-DD formatida)',
    example: '2025-06-15',
  })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({
    description: 'Mehmonlar soni',
    example: 150,
  })
  @IsNumber()
  @Min(1)
  guestCount: number;
}
