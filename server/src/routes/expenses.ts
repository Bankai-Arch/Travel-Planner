import { Router, Response } from 'express';
import Expense from '../models/Expense';
import { protect, AuthRequest } from '../middleware/auth';

const router = Router();

router.use(protect);

// Add expense
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const expense = await Expense.create({ ...(req.body as any), userId: req.user!.id });
    res.status(201).json({ success: true, expense });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Get expenses for a trip
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { tripId } = req.query as any;
    const expenses = await Expense.find({ tripId, userId: req.user!.id }).sort({ date: -1 });
    const total    = expenses.reduce((s, e) => s + e.amount, 0);
    res.json({ success: true, expenses, total });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete expense
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Expense.findOneAndDelete({ _id: (req.params as any).id, userId: req.user!.id });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
