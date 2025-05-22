import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Patch,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
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

@ApiTags('Users')
@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Yangi foydalanuvchi yaratish (admin uchun)' })
  @ApiResponse({
    status: 201,
    description: 'Foydalanuvchi muvaffaqiyatli yaratildi',
    type: CreateUserDto,
  })
  @ApiResponse({ status: 403, description: 'Faqat adminlar uchun' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Barcha foydalanuvchilarni ko‘rish (admin uchun)' })
  @ApiQuery({ name: 'role', required: false, enum: ['admin', 'owner', 'user'] })
  @ApiResponse({
    status: 200,
    description: 'Foydalanuvchilar ro‘yxati',
    type: [CreateUserDto],
  })
  @ApiResponse({ status: 403, description: 'Faqat adminlar uchun' })
  findAll(@Query('role') role?: string) {
    return this.usersService.findAll(role);
  }

  @Get(':id')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Foydalanuvchini ID bo‘yicha ko‘rish (admin uchun)',
  })
  @ApiResponse({
    status: 200,
    description: 'Foydalanuvchi ma‘lumotlari',
    type: CreateUserDto,
  })
  @ApiResponse({ status: 404, description: 'Foydalanuvchi topilmadi' })
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Foydalanuvchi ma‘lumotlarini yangilash (admin uchun)',
  })
  @ApiResponse({
    status: 200,
    description: 'Foydalanuvchi muvaffaqiyatli yangilandi',
    type: UpdateUserDto,
  })
  @ApiResponse({ status: 404, description: 'Foydalanuvchi topilmadi' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Foydalanuvchini o‘chirish (admin uchun)' })
  @ApiResponse({
    status: 204,
    description: 'Foydalanuvchi muvaffaqiyatli o‘chirildi',
  })
  @ApiResponse({ status: 404, description: 'Foydalanuvchi topilmadi' })
  delete(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
