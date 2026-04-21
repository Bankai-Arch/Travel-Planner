import { Request, Response } from 'express';
import Hotel from '../models/Hotel';
import Review from '../models/Review';

// ─── Get hotels with filters ──────────────────────────────────────────────────
export const getHotels = async (req: Request, res: Response) => {
  try {
    const {
      city, minPrice, maxPrice, rating, category,
      sort = 'rating', page = 1, limit = 12
    } = req.query;

    const filter: any = { available: true };
    if (city)     filter.city = { $regex: city as string, $options: 'i' };
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.pricePerNight = {};
      if (minPrice) filter.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerNight.$lte = Number(maxPrice);
    }
    if (rating) filter.rating = { $gte: Number(rating) };

    const sortMap: any = {
      rating:        { rating: -1 },
      price_low:     { pricePerNight: 1 },
      price_high:    { pricePerNight: -1 },
      reviews:       { reviewCount: -1 },
    };

    const skip = (Number(page) - 1) * Number(limit);
    const [hotels, total] = await Promise.all([
      Hotel.find(filter).sort(sortMap[sort as string] || { rating: -1 }).skip(skip).limit(Number(limit)),
      Hotel.countDocuments(filter),
    ]);

    res.json({
      success: true,
      hotels,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ─── Get single hotel with reviews ───────────────────────────────────────────
export const getHotel = async (req: Request, res: Response) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ error: 'Hotel not found' });

    const reviews = await Review.find({ targetId: hotel._id, targetType: 'hotel' })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ success: true, hotel, reviews });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ─── Create hotel (admin) ─────────────────────────────────────────────────────
export const createHotel = async (req: Request, res: Response) => {
  try {
    const hotel = await Hotel.create(req.body);
    res.status(201).json({ success: true, hotel });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// ─── Update hotel (admin) ─────────────────────────────────────────────────────
export const updateHotel = async (req: Request, res: Response) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!hotel) return res.status(404).json({ error: 'Hotel not found' });
    res.json({ success: true, hotel });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
