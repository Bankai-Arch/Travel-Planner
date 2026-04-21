import { Router } from 'express';
import { Request, Response } from 'express';
import Review from '../models/Review';
import Hotel from '../models/Hotel';
import { protect, AuthRequest } from '../middleware/auth';

const router = Router();

// Add a review
router.post('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { targetId, targetType, rating, title, comment } = req.body;

    const review = await Review.create({
      userId: req.user!.id, targetId, targetType, rating, title, comment,
    });

    // Update hotel average rating
    if (targetType === 'hotel') {
      const all = await Review.find({ targetId, targetType: 'hotel' });
      const avg = all.reduce((sum, r) => sum + r.rating, 0) / all.length;
      await Hotel.findByIdAndUpdate(targetId, { rating: Math.round(avg * 10) / 10, reviewCount: all.length });
    }

    const populated = await review.populate('userId', 'name avatar');
    res.status(201).json({ success: true, review: populated });
  } catch (err: any) {
    if (err.code === 11000) return res.status(400).json({ error: 'You have already reviewed this' });
    res.status(500).json({ error: err.message });
  }
});

// Get reviews for a target
router.get('/:targetType/:targetId', async (req: Request, res: Response) => {
  try {
    const { targetType, targetId } = req.params;
    const reviews = await Review.find({ targetId, targetType })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
