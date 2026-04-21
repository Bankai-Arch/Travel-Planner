import { Schema, model, Document } from 'mongoose';

export interface IBooking extends Document {
  userId:      Schema.Types.ObjectId;
  tripId:      Schema.Types.ObjectId;
  hotelId:     Schema.Types.ObjectId;
  checkIn:     Date;
  checkOut:    Date;
  guests:      number;
  totalAmount: number;
  status:      'pending' | 'confirmed' | 'cancelled';
  paymentId?:  string;
  createdAt:   Date;
}

const bookingSchema = new Schema<IBooking>({
  userId:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tripId:      { type: Schema.Types.ObjectId, ref: 'Trip' },
  hotelId:     { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
  checkIn:     { type: Date, required: true },
  checkOut:    { type: Date, required: true },
  guests:      { type: Number, default: 1 },
  totalAmount: { type: Number, required: true },
  status:      { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  paymentId:   String,
}, { timestamps: true });

export default model<IBooking>('Booking', bookingSchema);
