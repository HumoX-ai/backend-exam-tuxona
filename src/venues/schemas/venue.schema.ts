import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type VenueDocument = Venue & Document;

@Schema({ timestamps: true })
export class Venue {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ required: true })
  district: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  capacity: number;

  @Prop({ required: true })
  pricePerSeat: number;

  @Prop({ required: true })
  phone: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: User | Types.ObjectId;

  @Prop({ enum: ['pending', 'approved'], default: 'pending' })
  status: string;
}

export const VenueSchema = SchemaFactory.createForClass(Venue);
