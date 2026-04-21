import { Schema, model, Document } from 'mongoose';

export interface IHotel extends Document {
  name:          string;
  description:   string;
  city:          string;
  state:         string;
  country:       string;
  coordinates:   { lat: number; lng: number };
  pricePerNight: number;
  rating:        number;
  reviewCount:   number;
  amenities:     string[];
  images:        string[];
  category:      'budget' | 'mid-range' | 'luxury';
  available:     boolean;
}

const hotelSchema = new Schema<IHotel>({
  name:          { type: String, required: true },
  description:   String,
  city:          { type: String, required: true },
  state:         String,
  country:       { type: String, default: 'India' },
  coordinates:   { lat: Number, lng: Number },
  pricePerNight: { type: Number, required: true },
  rating:        { type: Number, default: 0, min: 0, max: 5 },
  reviewCount:   { type: Number, default: 0 },
  amenities:     [String],
  images:        [String],
  category:      { type: String, enum: ['budget', 'mid-range', 'luxury'], default: 'mid-range' },
  available:     { type: Boolean, default: true },
}, { timestamps: true });

hotelSchema.index({ city: 1, pricePerNight: 1 });
hotelSchema.index({ city: 'text', name: 'text' });

export default model<IHotel>('Hotel', hotelSchema);
