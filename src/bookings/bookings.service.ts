/* eslint-disable @typescript-eslint/no-base-to-string */
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose'; // Added Types
import { Booking, BookingDocument } from './schemas/booking.schema';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { UpdateBookingDto } from './dtos/update-booking.dto';
import { VenuesService } from '../venues/venues.service';
import { UsersService } from '../users/users.service';
import { VenueWithBookingsDto } from '../venues/dtos/venue-with-bookings.dto'; // Added

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
    // Load raw booking without population to use correct ObjectId fields
    const bookingDoc = await this.bookingModel.findById(id).exec();
    if (!bookingDoc) {
      throw new NotFoundException('Booking not found');
    }
    const booking = bookingDoc;
    const user = await this.usersService.findById(userId);

    // Determine venue ID from raw ObjectId
    let venueId: string;
    if (typeof booking.venue === 'object' && '_id' in booking.venue) {
      venueId = (
        booking.venue as { _id: Types.ObjectId | string }
      )._id.toString();
    } else {
      venueId = booking.venue.toString();
    }
    const venue = await this.venuesService.findById(venueId);

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
        venue: new Types.ObjectId(venueId),
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
    const booking = await this.findById(id); // booking.venue and booking.user are populated
    const user = await this.usersService.findById(userId);

    // Correctly get the venue ID string from the populated venue object
    // booking.venue is populated, so it's a VenueDocument. We need its _id.
    let venueId: string;
    if (
      booking.venue &&
      typeof booking.venue === 'object' &&
      '_id' in booking.venue &&
      booking.venue._id
    ) {
      venueId = (
        booking.venue as { _id: Types.ObjectId | string }
      )._id.toString();
    } else if (typeof booking.venue === 'string') {
      venueId = booking.venue;
    } else {
      throw new Error('Venue ID could not be determined');
    }
    // venuesService.findById returns VenueWithBookingsDto, which includes the owner.
    const venue: VenueWithBookingsDto =
      await this.venuesService.findById(venueId);

    // Get the string ID for the booking user
    // booking.user is populated, so it's a UserDocument.
    let bookingUserId: string;
    if (
      booking.user &&
      typeof booking.user === 'object' &&
      '_id' in booking.user &&
      booking.user._id
    ) {
      bookingUserId = (
        booking.user as { _id: Types.ObjectId | string }
      )._id.toString();
    } else if (typeof booking.user === 'string') {
      bookingUserId = booking.user;
    } else {
      throw new Error('Booking user ID could not be determined');
    }

    // Get the string ID for the venue owner
    // venue.owner can be a populated object or just an ID string depending on how it was populated.
    // In VenueWithBookingsDto, owner is populated (UserDocument or similar structure with _id).
    let venueOwnerIdString: string;
    if (typeof venue.owner === 'string') {
      venueOwnerIdString = venue.owner;
    } else if (
      venue.owner &&
      typeof venue.owner === 'object' &&
      '_id' in venue.owner
    ) {
      venueOwnerIdString = (
        venue.owner as { _id: Types.ObjectId | string }
      )._id.toString();
    } else {
      // Fallback or error handling if owner structure is unexpected
      throw new Error('Venue owner ID could not be determined');
    }

    if (
      user.role !== 'admin' &&
      bookingUserId !== userId &&
      venueOwnerIdString !== userId
    ) {
      throw new ForbiddenException(
        'Only admins, booking owner, or venue owner can delete this booking',
      );
    }

    await this.bookingModel.findByIdAndDelete(id).exec();
  }
}
