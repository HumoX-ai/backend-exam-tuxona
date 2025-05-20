import {
  IsOptional,
  IsString,
  IsNumberString,
  IsBooleanString,
  IsDateString,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterVenuesDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Venue nomi yoki boshqa kalit so‘zlar' })
  query?: string;

  @IsOptional()
  @IsNumberString()
  @ApiPropertyOptional({ description: 'Soni (chegaralangan)' })
  limit?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Saralash bo‘yicha maydon' })
  sortBy?: 'name' | 'capacity' | 'pricePerSeat';

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Saralash tartibi (asc/desc)' })
  sortOrder?: 'asc' | 'desc';

  @IsOptional()
  @IsNumberString()
  @ApiPropertyOptional({ description: 'Minimal sig‘im' })
  capacity?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Tuman bo‘yicha filter' })
  district?: string;

  @IsOptional()
  @IsNumberString()
  @ApiPropertyOptional({ description: 'Minimal narx (1 o‘rindiq uchun)' })
  minPricePerSeat?: number;

  @IsOptional()
  @IsNumberString()
  @ApiPropertyOptional({ description: 'Maksimal narx (1 o‘rindiq uchun)' })
  maxPricePerSeat?: number;

  @IsOptional()
  @IsBooleanString()
  @ApiPropertyOptional({ description: 'Faqat rasmi bor joylar' })
  hasImages?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description: 'Qidirilayotgan sanadan (bandlikka qarab)',
  })
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description: 'Qidirilayotgan sana uchun (bandlikka qarab)',
  })
  toDate?: string;
}
