import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { config } from './config/env';
import { connectDB } from './config/db';
import { initSocket } from './config/socket';
import authRoutes from './routes/auth';
import tripRoutes from './routes/trips';
import aiRoutes from './routes/ai';
import hotelRoutes from './routes/hotels';
import reviewRoutes from './routes/reviews';
import adminRoutes from './routes/admin';
import expenseRoutes from './routes/expenses';
import { errorHandler } from './middleware/error';

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(helmet());
app.use(cors({ origin: config.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/expenses', expenseRoutes);

// Global error handler
app.use(errorHandler);

// Start
connectDB().then(() => {
  initSocket(httpServer);
  httpServer.listen(config.PORT, () =>
    console.log(`🚀 Server running on http://localhost:${config.PORT}`)
  );
});
