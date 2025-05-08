import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class VenueWithBookingsDto {
  @ApiProperty({
    description: 'To‘yxona IDsi',
    example: '60c72b2f9b1e8c001c8b4567',
  })
  _id: Types.ObjectId;

  @ApiProperty({ description: 'To‘yxona nomi', example: 'Navruz Saroyi' })
  name: string;

  @ApiProperty({
    description: 'Rasmlar ro‘yxati',
    example: ['https://example.com/image1.jpg'],
  })
  images: string[];

  @ApiProperty({ description: 'Tuman', example: 'Chilonzor' })
  district: string;

  @ApiProperty({ description: 'Manzil', example: 'Chilonzor ko‘chasi, 45-uy' })
  address: string;

  @ApiProperty({ description: 'Sig‘im', example: 200 })
  capacity: number;

  @ApiProperty({ description: 'Bir o‘rindiq narxi (so‘m)', example: 50000 })
  pricePerSeat: number;

  @ApiProperty({ description: 'Telefon raqami', example: '+998901234567' })
  phone: string;

  @ApiProperty({ description: 'Egasi (foydalanuvchi)', type: Object })
  owner: any;

  @ApiProperty({ description: 'Holati', example: 'approved' })
  status: string;

  @ApiProperty({ description: 'To‘yxona bandligi', example: true })
  isBooked: boolean;

  @ApiProperty({
    description: 'Bron qilingan sanalar (YYYY-MM-DD formatida)',
    example: ['2025-06-15', '2025-06-20'],
  })
  bookedDates: string[];
}
