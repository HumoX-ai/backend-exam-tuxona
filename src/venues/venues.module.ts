import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VenuesService } from './venues.service';
import { VenuesController } from './venues.controller';
import { Venue, VenueSchema } from './schemas/venue.schema';
import { Booking, BookingSchema } from '../bookings/schemas/booking.schema';
import { UsersModule } from '../users/users.module';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Venue.name, schema: VenueSchema },
      { name: Booking.name, schema: BookingSchema },
    ]),
    UsersModule,
    forwardRef(() => BookingsModule), // Circular dependency ni hal qilish uchun forwardRef
  ],
  controllers: [VenuesController],
  providers: [VenuesService],
  exports: [VenuesService],
})
export class VenuesModule {}
