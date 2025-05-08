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
  Query, // Query import qo‘shildi
} from '@nestjs/common';
import { VenuesService } from './venues.service';
import { CreateVenueDto } from './dtos/create-venue.dto';
import { UpdateVenueDto } from './dtos/update-venue.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { VenueWithBookingsDto } from './dtos/venue-with-bookings.dto';

@ApiTags('Venues')
@Controller('venues')
export class VenuesController {
  constructor(private venuesService: VenuesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('owner', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Yangi to‘yxona yaratish (owner yoki admin uchun)' })
  @ApiResponse({
    status: 201,
    description: 'To‘yxona muvaffaqiyatli yaratildi',
    type: CreateVenueDto,
  })
  @ApiResponse({ status: 403, description: 'Faqat owner yoki adminlar uchun' })
  async create(@Body() createVenueDto: CreateVenueDto, @Request() req) {
    return this.venuesService.create(createVenueDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha tasdiqlangan to‘yxonalarni ko‘rish' })
  @ApiResponse({
    status: 200,
    description: 'To‘yxonalarni ro‘yxati, bandlik holati va sanalari bilan',
    type: [VenueWithBookingsDto],
  })
  async findAll() {
    return this.venuesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'To‘yxonani ID bo‘yicha ko‘rish' })
  @ApiResponse({
    status: 200,
    description: 'To‘yxona ma‘lumotlari',
    type: CreateVenueDto,
  })
  @ApiResponse({ status: 404, description: 'To‘yxona topilmadi' })
  async findOne(@Param('id') id: string) {
    return this.venuesService.findById(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('owner', 'admin')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'To‘yxona ma‘lumotlarini yangilash (owner yoki admin uchun)',
  })
  @ApiResponse({
    status: 200,
    description: 'To‘yxona muvaffaqiyatli yangilandi',
    type: UpdateVenueDto,
  })
  @ApiResponse({ status: 403, description: 'Faqat owner yoki adminlar uchun' })
  @ApiResponse({ status: 404, description: 'To‘yxona topilmadi' })
  async update(
    @Param('id') id: string,
    @Body() updateVenueDto: UpdateVenueDto,
    @Request() req,
  ) {
    return this.venuesService.update(id, updateVenueDto, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('owner', 'admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'To‘yxonani o‘chirish (owner yoki admin uchun)' })
  @ApiResponse({
    status: 204,
    description: 'To‘yxona muvaffaqiyatli o‘chirildi',
  })
  @ApiResponse({ status: 403, description: 'Faqat owner yoki adminlar uchun' })
  @ApiResponse({ status: 404, description: 'To‘yxona topilmadi' })
  async delete(@Param('id') id: string, @Request() req) {
    return this.venuesService.remove(id, req.user.userId);
  }

  @Get(':id/calendar')
  @ApiOperation({
    summary:
      'To‘yxona kalendarini ko‘rish (berilgan sana bandligini tekshirish)',
  })
  @ApiQuery({
    name: 'date',
    required: true,
    description: 'Tekshiriladigan sana (YYYY-MM-DD formatida)',
    example: '2025-06-15',
  })
  @ApiResponse({
    status: 200,
    description: 'Sanadagi bandlik holati',
    type: Object,
  })
  @ApiResponse({ status: 404, description: 'To‘yxona topilmadi' })
  async getCalendar(@Param('id') id: string, @Query('date') date: string) {
    return this.venuesService.getCalendar(id, date);
  }
}
