import { Router } from 'express';
import { planTrip, chat, optimizeBudget } from '../controllers/ai.controller';
import { protect } from '../middleware/auth';
import rateLimit from 'express-rate-limit';

// Limit AI calls to 20 per hour per user
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { error: 'Too many AI requests. Please try again later.' },
});

const router = Router();

router.post('/plan-trip',       protect, aiLimiter, planTrip);
router.post('/chat',            protect, chat);
router.post('/optimize-budget', protect, aiLimiter, optimizeBudget);

export default router;
