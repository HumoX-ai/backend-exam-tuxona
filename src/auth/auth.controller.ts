import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Foydalanuvchi tizimga kirishi' })
  @ApiResponse({
    status: 200,
    description: 'Muvaffaqiyatli login, JWT token qaytariladi',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: '1234567890',
          username: 'ali',
          role: 'user',
          firstName: 'Ali',
          lastName: 'Valiyev',
          phone: '+998901234567',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Noto‘g‘ri username yoki parol' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Yangi foydalanuvchi ro‘yxatdan o‘tkazish' })
  @ApiResponse({
    status: 201,
    description: 'Muvaffaqiyatli ro‘yxatdan o‘tish, JWT token qaytariladi',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: '1234567890',
          username: 'ali',
          role: 'user',
          firstName: 'Ali',
          lastName: 'Valiyev',
          phone: '+998901234567',
        },
      },
    },
  })
  @ApiResponse({ status: 409, description: 'Username allaqachon mavjud' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get('profile') // <-- Yangi endpoint
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Token orqali foydalanuvchi ma'lumotlarini olish" })
  @ApiResponse({
    status: 200,
    description: "Foydalanuvchi ma'lumotlari",
    schema: {
      example: {
        id: '1234567890',
        username: 'ali',
        role: 'user',
        firstName: 'Ali',
        lastName: 'Valiyev',
        phone: '+998901234567',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Token yaroqsiz yoki mavjud emas' })
  getProfile(@Req() req) {
    // req.user AuthGuard tomonidan tokendan olingan payloadni saqlaydi
    // To'liq user ma'lumotlarini olish uchun UsersService dan foydalanamiz
    return this.authService.getUserFromToken(req.user);
  }

  @Post('admin/register')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Admin tomonidan yangi foydalanuvchi ro‘yxatdan o‘tkazish',
  })
  @ApiResponse({
    status: 201,
    description: 'Muvaffaqiyatli ro‘yxatdan o‘tish, JWT token qaytariladi',
  })
  @ApiResponse({ status: 403, description: 'Faqat adminlar uchun' })
  async adminRegister(@Body() registerDto: RegisterDto) {
    return this.authService.register({
      ...registerDto,
      role: registerDto.role || 'user',
    });
  }
}
