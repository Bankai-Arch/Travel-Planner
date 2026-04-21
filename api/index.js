// api/index.js
// This file wraps the Express server for Vercel Serverless Functions.
// Vercel calls this file as a single serverless function for all /api/* routes.

const express       = require('express');
const cors          = require('cors');
const helmet        = require('helmet');
const mongoose      = require('mongoose');
const { createServer } = require('http');
require('dotenv').config();

// ── Import all route modules (compiled JS from server/dist) ─────────────────
// Build step: `cd server && npm run build` compiles TypeScript → dist/
const authRoutes    = require('../server/dist/routes/auth').default;
const tripRoutes    = require('../server/dist/routes/trips').default;
const aiRoutes      = require('../server/dist/routes/ai').default;
const hotelRoutes   = require('../server/dist/routes/hotels').default;
const reviewRoutes  = require('../server/dist/routes/reviews').default;
const adminRoutes   = require('../server/dist/routes/admin').default;
const expenseRoutes = require('../server/dist/routes/expenses').default;
const { errorHandler } = require('../server/dist/middleware/error');

// ── MongoDB: reuse connection across warm lambda invocations ─────────────────
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI, {
    bufferCommands: false,
    maxPoolSize: 5,          // Keep pool small for serverless
  });
  isConnected = true;
  console.log('MongoDB connected (serverless)');
}

// ── Build Express app ────────────────────────────────────────────────────────
const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Authorization', 'Content-Type'],
}));
app.use(express.json({ limit: '10mb' }));

// Connect DB before handling any route
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// ── Mount routes ─────────────────────────────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/trips',    tripRoutes);
app.use('/api/ai',       aiRoutes);
app.use('/api/hotels',   hotelRoutes);
app.use('/api/reviews',  reviewRoutes);
app.use('/api/admin',    adminRoutes);
app.use('/api/expenses', expenseRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global error handler
app.use(errorHandler);

// ── Export for Vercel ────────────────────────────────────────────────────────
module.exports = app;
