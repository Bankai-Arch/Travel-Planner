import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Trip from '../models/Trip';

// ─── Get user's trips ─────────────────────────────────────────────────────────
export const getMyTrips = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const trips = await Trip.find({
      $or: [{ userId: req.user!.id }, { collaborators: req.user!.id }],
    }).sort({ createdAt: -1 });

    res.json({ success: true, trips });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ─── Get single trip ──────────────────────────────────────────────────────────
export const getTrip = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('userId', 'name avatar')
      .populate('collaborators', 'name avatar');

    if (!trip) { res.status(404).json({ error: 'Trip not found' }); return; }

    // Allow owner, collaborators, or public trips
    const isOwner = (trip.userId as any)._id.toString() === req.user!.id;
    const isCollab = trip.collaborators.some((c: any) => c._id.toString() === req.user!.id);
    if (!isOwner && !isCollab && !trip.isPublic) {
      res.status(403).json({ error: 'Access denied' }); return;
    }

    res.json({ success: true, trip });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ─── Update trip ──────────────────────────────────────────────────────────────
export const updateTrip = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user!.id });
    if (!trip) { res.status(404).json({ error: 'Trip not found or not authorized' }); return; }

    Object.assign(trip, req.body);
    await trip.save();

    res.json({ success: true, trip });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// ─── Delete trip ──────────────────────────────────────────────────────────────
export const deleteTrip = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const trip = await Trip.findOneAndDelete({ _id: req.params.id, userId: req.user!.id });
    if (!trip) { res.status(404).json({ error: 'Trip not found or not authorized' }); return; }
    res.json({ success: true, message: 'Trip deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ─── Invite collaborator ──────────────────────────────────────────────────────
export const addCollaborator = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.body;
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user!.id });
    if (!trip) { res.status(404).json({ error: 'Trip not found' }); return; }

    if (!trip.collaborators.includes(userId)) {
      trip.collaborators.push(userId);
      await trip.save();
    }

    res.json({ success: true, trip });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ─── Popular public trips ─────────────────────────────────────────────────────
export const getPublicTrips = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { destination, page = 1, limit = 9 } = req.query;
    const filter: any = { isPublic: true };
    if (destination) filter.destination = { $regex: destination as string, $options: 'i' };

    const trips = await Trip.find(filter)
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({ success: true, trips });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
