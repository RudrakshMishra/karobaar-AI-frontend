require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cors = require('./middleware/cors');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(compression());
app.use(cors);
app.use('/api/webhooks', require('./routes/webhooks.routes'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => res.json({ status: 'Karobaar AI Backend is running', version: '1.0.0' }));
// app.use('/api/auth', require('./routes/auth.routes')); // Removed - using Clerk
app.use('/api/user', require('./routes/user.routes'));
app.use('/api/onboarding', require('./routes/onboarding.routes'));
app.use('/api/data', require('./routes/data.routes'));
app.use('/api/dashboard', require('./routes/dashboard.routes'));
app.use('/api/products', require('./routes/products.routes'));
app.use('/api/profit', require('./routes/profit.routes'));
app.use('/api/ai', require('./routes/ai.routes'));
app.use('/api/inventory', require('./routes/inventory.routes'));
app.use('/api/competitors', require('./routes/competitors.routes'));
app.use('/api/pricing', require('./routes/pricing.routes'));
app.use('/api/reports', require('./routes/reports.routes'));
app.use('/api/billing', require('./routes/billing.routes'));

// Error handling
app.use(errorHandler);

// Cron Jobs
require('./cron/jobs');

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
