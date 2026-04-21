import { Router } from 'express';
import {
  getMyTrips, getTrip, updateTrip, deleteTrip,
  addCollaborator, getPublicTrips,
} from '../controllers/trip.controller';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/public',              protect, getPublicTrips);
router.get('/my',                  protect, getMyTrips);
router.get('/:id',                 protect, getTrip);
router.put('/:id',                 protect, updateTrip);
router.delete('/:id',              protect, deleteTrip);
router.post('/:id/collaborators',  protect, addCollaborator);

export default router;
