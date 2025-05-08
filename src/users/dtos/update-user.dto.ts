import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsOptional, IsEnum } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Foydalanuvchi ismi',
    example: 'Ali',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'Foydalanuvchi familiyasi',
    example: 'Valiyev',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'Foydalanuvchi nomi (unikal)',
    example: 'ali',
    required: false,
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    description: 'Foydalanuvchi paroli (kamida 6 belgi)',
    example: '123456',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty({
    description: 'Foydalanuvchi telefon raqami',
    example: '+998901234567',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'Foydalanuvchi roli (admin, owner, user)',
    example: 'user',
    required: false,
  })
  @IsOptional()
  @IsEnum(['admin', 'owner', 'user'])
  role?: 'admin' | 'owner' | 'user';
}
