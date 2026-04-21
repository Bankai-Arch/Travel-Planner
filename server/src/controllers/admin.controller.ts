import { Request, Response } from 'express';
import User from '../models/User';
import Trip from '../models/Trip';
import Booking from '../models/Booking';
import Hotel from '../models/Hotel';

export const getStats = async (req: Request, res: Response) => {
  try {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const [totalUsers, totalTrips, totalHotels, monthlyBookings] = await Promise.all([
      User.countDocuments(),
      Trip.countDocuments(),
      Hotel.countDocuments(),
      Booking.countDocuments({ createdAt: { $gte: startOfMonth } }),
    ]);

    // Top 5 destinations
    const topDestinations = await Trip.aggregate([
      { $group: { _id: '$destination', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { destination: '$_id', count: 1, _id: 0 } },
    ]);

    // Monthly revenue (last 6 months)
    const revenueByMonth = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 6 },
    ]);

    // New users over last 7 days
    const newUsersDaily = await User.aggregate([
      { $match: { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      stats: { totalUsers, totalTrips, totalHotels, monthlyBookings },
      topDestinations,
      revenueByMonth,
      newUsersDaily,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Paginated user list for admin
export const getUsers = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const filter: any = {};
    if (search) filter.$or = [
      { name:  { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];

    const [users, total] = await Promise.all([
      User.find(filter).skip((Number(page) - 1) * Number(limit)).limit(Number(limit)).sort({ createdAt: -1 }),
      User.countDocuments(filter),
    ]);

    res.json({ success: true, users, total });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
