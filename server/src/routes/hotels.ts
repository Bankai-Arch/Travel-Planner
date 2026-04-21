import { Router } from 'express';
import { getHotels, getHotel, createHotel, updateHotel } from '../controllers/hotel.controller';
import { protect, adminOnly } from '../middleware/auth';

const router = Router();

router.get('/',        getHotels);
router.get('/:id',     getHotel);
router.post('/',       protect, adminOnly, createHotel);
router.put('/:id',     protect, adminOnly, updateHotel);

export default router;
