import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsOptional, IsEnum } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Foydalanuvchi ismi',
    example: 'Ali',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Foydalanuvchi familiyasi',
    example: 'Valiyev',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Foydalanuvchi nomi (unikal)',
    example: 'ali',
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Foydalanuvchi paroli (kamida 6 belgi)',
    example: '123456',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Foydalanuvchi telefon raqami',
    example: '+998901234567',
  })
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'Foydalanuvchi roli (admin, owner, user)',
    example: 'user',
    required: false,
  })
  @IsOptional()
  @IsEnum(['admin', 'owner', 'user'])
  role?: 'admin' | 'owner' | 'user';
}
