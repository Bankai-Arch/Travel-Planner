import dotenv from 'dotenv';
dotenv.config();

export const config = {
  PORT:                  process.env.PORT || 5000,
  MONGO_URI:             process.env.MONGO_URI!,
  REDIS_URL:             process.env.REDIS_URL!,
  JWT_SECRET:            process.env.JWT_SECRET!,
  JWT_EXPIRES_IN:        process.env.JWT_EXPIRES_IN || '7d',
  CLIENT_URL:            process.env.CLIENT_URL || 'http://localhost:3000',
  OPENAI_API_KEY:        process.env.OPENAI_API_KEY!,
  GOOGLE_MAPS_KEY:       process.env.GOOGLE_MAPS_KEY!,
  WEATHER_API_KEY:       process.env.WEATHER_API_KEY!,
  STRIPE_SECRET:         process.env.STRIPE_SECRET_KEY!,
  CLOUDINARY_URL:        process.env.CLOUDINARY_URL!,
  AMADEUS_CLIENT_ID:     process.env.AMADEUS_CLIENT_ID || '',
  AMADEUS_CLIENT_SECRET: process.env.AMADEUS_CLIENT_SECRET || '',
  NODE_ENV:              process.env.NODE_ENV || 'development',
};
