import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Foydalanuvchi nomi (username)',
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
}
