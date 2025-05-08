import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { UpdateBookingDto } from './dtos/update-booking.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @Roles('user', 'admin', 'owner')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Yangi bron qilish' })
  @ApiResponse({
    status: 201,
    description: 'Bron muvaffaqiyatli yaratildi',
    type: CreateBookingDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Sana allaqachon band yoki noto‘g‘ri ma’lumot',
  })
  async create(@Body() createBookingDto: CreateBookingDto, @Request() req) {
    return this.bookingsService.create(createBookingDto, req.user.userId);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Barcha bronlarni ko‘rish (admin uchun)' })
  @ApiResponse({
    status: 200,
    description: 'Bronlar ro‘yxati',
    type: [CreateBookingDto],
  })
  @ApiResponse({ status: 403, description: 'Faqat adminlar uchun' })
  async findAll() {
    return this.bookingsService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bronni ID bo‘yicha ko‘rish' })
  @ApiResponse({
    status: 200,
    description: 'Bron ma‘lumotlari',
    type: CreateBookingDto,
  })
  @ApiResponse({ status: 404, description: 'Bron topilmadi' })
  async findOne(@Param('id') id: string) {
    return this.bookingsService.findById(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bron ma‘lumotlarini yangilash' })
  @ApiResponse({
    status: 200,
    description: 'Bron muvaffaqiyatli yangilandi',
    type: UpdateBookingDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Faqat admin, bron egasi yoki to‘yxona egasi',
  })
  @ApiResponse({ status: 404, description: 'Bron topilmadi' })
  async update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
    @Request() req,
  ) {
    return this.bookingsService.update(id, updateBookingDto, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bronni o‘chirish' })
  @ApiResponse({ status: 204, description: 'Bron muvaffaqiyatli o‘chirildi' })
  @ApiResponse({
    status: 403,
    description: 'Faqat admin, bron egasi yoki to‘yxona egasi',
  })
  @ApiResponse({ status: 404, description: 'Bron topilmadi' })
  async delete(@Param('id') id: string, @Request() req) {
    return this.bookingsService.remove(id, req.user.userId);
  }
}
