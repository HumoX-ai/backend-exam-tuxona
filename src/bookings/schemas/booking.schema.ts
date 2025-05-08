import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Venue } from '../../venues/schemas/venue.schema';

export type BookingDocument = Booking & Document;

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Venue', required: true })
  venue: Venue | Types.ObjectId;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  guestCount: number;

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' })
  status: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
