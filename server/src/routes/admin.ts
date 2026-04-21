import { Router } from 'express';
import { getStats, getUsers } from '../controllers/admin.controller';
import { protect, adminOnly } from '../middleware/auth';

const router = Router();

router.use(protect, adminOnly);   // All admin routes require auth + admin role

router.get('/stats', getStats);
router.get('/users', getUsers);

export default router;
