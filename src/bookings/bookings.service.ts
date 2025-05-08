/* eslint-disable @typescript-eslint/no-base-to-string */
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from './schemas/booking.schema';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { UpdateBookingDto } from './dtos/update-booking.dto';
import { VenuesService } from '../venues/venues.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    private venuesService: VenuesService,
    private usersService: UsersService,
  ) {}

  async create(
    createBookingDto: CreateBookingDto,
    userId: string,
  ): Promise<Booking> {
    // const user = await this.usersService.findById(userId);
    const venue = await this.venuesService.findById(createBookingDto.venue);

    if (venue.status !== 'approved') {
      throw new BadRequestException('Venue is not approved');
    }

    // Sanani tekshirish: o’sha kuni boshqa bron bor-yo’qligini
    const existingBooking = await this.bookingModel.findOne({
      venue: createBookingDto.venue,
      date: new Date(createBookingDto.date),
      status: { $ne: 'cancelled' },
    });
    if (existingBooking) {
      throw new BadRequestException(
        'This date is already booked for the venue',
      );
    }

    // Umumiy narxni hisoblash
    const totalPrice = createBookingDto.guestCount * venue.pricePerSeat;

    const booking = new this.bookingModel({
      user: userId,
      venue: createBookingDto.venue,
      date: new Date(createBookingDto.date),
      guestCount: createBookingDto.guestCount,
      totalPrice,
      status: 'pending',
    });

    return booking.save();
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingModel.find().populate('user').populate('venue').exec();
  }

  async findById(id: string): Promise<Booking> {
    const booking = await this.bookingModel
      .findById(id)
      .populate('user')
      .populate('venue')
      .exec();
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }

  async update(
    id: string,
    updateBookingDto: UpdateBookingDto,
    userId: string,
  ): Promise<Booking> {
    const booking = await this.findById(id);
    const user = await this.usersService.findById(userId);

    const venue = await this.venuesService.findById(booking.venue.toString());
    if (
      user.role !== 'admin' &&
      booking.user.toString() !== userId &&
      venue.owner.toString() !== userId
    ) {
      throw new ForbiddenException(
        'Only admins, booking owner, or venue owner can update this booking',
      );
    }

    if (user.role !== 'admin' && updateBookingDto.status) {
      throw new ForbiddenException('Only admins can update booking status');
    }

    if (updateBookingDto.date) {
      const existingBooking = await this.bookingModel.findOne({
        venue: booking.venue,
        date: new Date(updateBookingDto.date),
        status: { $ne: 'cancelled' },
        _id: { $ne: id },
      });
      if (existingBooking) {
        throw new BadRequestException(
          'This date is already booked for the venue',
        );
      }
    }

    if (updateBookingDto.guestCount) {
      updateBookingDto.totalPrice =
        updateBookingDto.guestCount * venue.pricePerSeat;
    }

    const updatedBooking = await this.bookingModel
      .findByIdAndUpdate(id, updateBookingDto, { new: true })
      .populate('user')
      .populate('venue')
      .exec();

    if (!updatedBooking) {
      throw new NotFoundException('Booking not found after update');
    }

    return updatedBooking;
  }

  async remove(id: string, userId: string): Promise<void> {
    const booking = await this.findById(id);
    const user = await this.usersService.findById(userId);

    const venue = await this.venuesService.findById(booking.venue.toString());
    if (
      user.role !== 'admin' &&
      booking.user.toString() !== userId &&
      venue.owner.toString() !== userId
    ) {
      throw new ForbiddenException(
        'Only admins, booking owner, or venue owner can delete this booking',
      );
    }

    await this.bookingModel.findByIdAndDelete(id).exec();
  }
}
