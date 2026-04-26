const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/user/user.routes');
const dataRoutes = require('./modules/data/data.routes');
const analyticsRoutes = require('./modules/analytics/analytics.routes');
const aiRoutes = require('./modules/ai/ai.routes');
// const competitorRoutes = require('./modules/competitor/competitor.routes');
// const inventoryRoutes = require('./modules/inventory/inventory.routes');
const paymentRoutes = require('./modules/payments/payments.routes');
const invoicesRoutes = require('./modules/invoices/invoices.routes');

const app = express();

// Security HTTP headers
app.use(helmet());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Global Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Built-in body parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// CORS setup
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);
// app.use('/api/competitor', competitorRoutes);
// app.use('/api/inventory', inventoryRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/invoices', invoicesRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Karobaar AI Backend is healthy' });
});

// 404 handler
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

// Global Error Handler Middleware
app.use(errorHandler);

module.exports = app;
