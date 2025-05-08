import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min, IsEnum } from 'class-validator';

export class VenueFilterDto {
  @ApiProperty({
    description: 'To‘yxona nomi bo‘yicha qidiruv',
    example: 'Navruz',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'To‘yxona joylashgan tuman',
    example: 'Chilonzor',
    required: false,
  })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiProperty({
    description: 'Minimal sig‘im',
    example: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  minCapacity?: number;

  @ApiProperty({
    description: 'Maksimal sig‘im',
    example: 500,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxCapacity?: number;

  @ApiProperty({
    description: 'Minimal narx (bir kishi uchun)',
    example: 30000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiProperty({
    description: 'Maksimal narx (bir kishi uchun)',
    example: 100000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiProperty({
    description: 'To‘yxona holati (pending yoki approved)',
    example: 'approved',
    required: false,
  })
  @IsOptional()
  @IsEnum(['pending', 'approved'])
  status?: string;
}
