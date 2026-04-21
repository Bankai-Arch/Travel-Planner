import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { config } from '../config/env';

const signToken = (id: string, role: string) =>
  jwt.sign({ id, role }, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN as any });

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) { res.status(400).json({ error: 'Email already registered' }); return; }

    const user = await User.create({ name, email, password });
    const token = signToken(user._id.toString(), user.role);

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) { res.status(401).json({ error: 'Invalid email or password' }); return; }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) { res.status(401).json({ error: 'Invalid email or password' }); return; }

    const token = signToken(user._id.toString(), user.role);

    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getMe = async (req: any, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user.id).populate('savedTrips', 'title destination status');
    if (!user) { res.status(404).json({ error: 'User not found' }); return; }
    res.json({ success: true, user });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
