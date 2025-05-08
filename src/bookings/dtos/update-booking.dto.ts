import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsDateString,
  IsEnum,
  IsOptional,
  Min,
} from 'class-validator';

export class UpdateBookingDto {
  @ApiProperty({
    description: 'Bron qilinadigan sana (YYYY-MM-DD formatida)',
    example: '2025-06-15',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({
    description: 'Mehmonlar soni',
    example: 150,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  guestCount?: number;

  @ApiProperty({
    description: 'Bron holati (pending, confirmed, cancelled)',
    example: 'confirmed',
    required: false,
  })
  @IsOptional()
  @IsEnum(['pending', 'confirmed', 'cancelled'])
  status?: string;

  @ApiProperty({
    description: 'Umumiy narx (so‘m)',
    example: 7500000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalPrice?: number;
}
