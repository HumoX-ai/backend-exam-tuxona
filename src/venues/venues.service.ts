/* eslint-disable @typescript-eslint/no-base-to-string */
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Venue, VenueDocument } from './schemas/venue.schema';
import { CreateVenueDto } from './dtos/create-venue.dto';
import { UpdateVenueDto } from './dtos/update-venue.dto';
import { VenueWithBookingsDto } from './dtos/venue-with-bookings.dto';
import { UsersService } from '../users/users.service';
import { Booking, BookingDocument } from '../bookings/schemas/booking.schema';
import axios from 'axios';
import * as FormData from 'form-data';

@Injectable()
export class VenuesService {
  constructor(
    @InjectModel(Venue.name) private venueModel: Model<VenueDocument>,
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    private usersService: UsersService,
  ) {}

  async create(createVenueDto: CreateVenueDto, userId: string): Promise<Venue> {
    const user = await this.usersService.findById(userId);
    if (user.role !== 'owner' && user.role !== 'admin') {
      throw new ForbiddenException('Only owners or admins can create venues');
    }

    const venue = new this.venueModel({
      ...createVenueDto,
      owner: userId,
      status: user.role === 'admin' ? 'approved' : 'pending',
    });
    return venue.save();
  }

  async findAll(): Promise<VenueWithBookingsDto[]> {
    const venues = await this.venueModel
      .find({ status: 'approved' })
      .populate('owner')
      .lean()
      .exec();

    return Promise.all(
      venues.map(async (venue) => {
        const bookings = await this.bookingModel
          .find({
            venue: venue._id.toString(),
            status: { $in: ['pending', 'confirmed'] },
          })
          .lean()
          .exec();

        const bookedDates = bookings.map(
          (booking) => new Date(booking.date).toISOString().split('T')[0],
        );

        return {
          ...venue,
          _id: new Types.ObjectId(venue._id.toString()),
          isBooked: bookedDates.length > 0,
          bookedDates,
        };
      }),
    );
  }

  async findById(id: string): Promise<Venue> {
    const venue = await this.venueModel.findById(id).populate('owner').exec();
    if (!venue) {
      throw new NotFoundException('Venue not found');
    }
    return venue;
  }

  async update(
    id: string,
    updateVenueDto: UpdateVenueDto,
    userId: string,
  ): Promise<Venue> {
    const venue = await this.findById(id);
    const user = await this.usersService.findById(userId);

    if (user.role !== 'admin' && venue.owner.toString() !== userId) {
      throw new ForbiddenException(
        'Only admins or venue owners can update this venue',
      );
    }

    if (user.role !== 'admin' && updateVenueDto.status) {
      throw new ForbiddenException('Only admins can update venue status');
    }

    const updatedVenue = await this.venueModel
      .findByIdAndUpdate(id, updateVenueDto, { new: true })
      .populate('owner')
      .exec();

    if (!updatedVenue) {
      throw new NotFoundException('Venue not found');
    }

    return updatedVenue;
  }

  async remove(id: string, userId: string): Promise<void> {
    const venue = await this.findById(id);
    const user = await this.usersService.findById(userId);

    if (user.role !== 'admin' && venue.owner.toString() !== userId) {
      throw new ForbiddenException(
        'Only admins or venue owners can delete this venue',
      );
    }

    await this.venueModel.findByIdAndDelete(id).exec();
  }

  async getCalendar(
    venueId: string,
    date: string,
  ): Promise<{ isBooked: boolean }> {
    await this.findById(venueId);

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      throw new BadRequestException('Date must be in YYYY-MM-DD format');
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new BadRequestException('Invalid date');
    }

    const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(parsedDate.setHours(23, 59, 59, 999));

    const booking = await this.bookingModel
      .findOne({
        venue: venueId,
        date: { $gte: startOfDay, $lte: endOfDay },
        status: { $ne: 'cancelled' },
      })
      .exec();

    return { isBooked: !!booking };
  }

  async uploadToImgbb(buffer: Buffer, apiKey: string): Promise<string> {
    const formData = new FormData();
    formData.append('image', buffer.toString('base64')); // Send base64 string as form field

    try {
      const res = await axios.post<{ data: { url: string } }>(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        formData,
        {
          headers: {
            ...formData.getHeaders(), // Sets Content-Type to multipart/form-data with boundary
          },
        },
      );
      return res.data.data.url;
    } catch (error) {
      console.error(
        'ImgBB upload error:',
        error.response?.data || error.message,
      );
      throw new BadRequestException('Failed to upload image to ImgBB');
    }
  }

  async addImageFromImgbb(
    venueId: string,
    file: Express.Multer.File,
  ): Promise<Venue> {
    const venue = await this.venueModel.findById(venueId);
    if (!venue) throw new NotFoundException('Venue not found');

    const apiKey =
      process.env.IMGBB_API_KEY || '16116008be0e3d2ddf6f9e1b9a10a799';
    if (!apiKey) throw new BadRequestException('IMGBB API key not set');

    if (!file || !file.buffer)
      throw new BadRequestException('File not found or invalid format');

    const imageUrl = await this.uploadToImgbb(file.buffer, apiKey);
    venue.images.push(imageUrl);
    await venue.save();
    return venue;
  }
}
