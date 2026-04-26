import os

base_dir = r"c:\Users\Asus\.gemini\antigravity\scratch\karobaar-ai\server"

files_to_create = {
    "index.js": """require('dotenv').config();
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
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
""",
    "utils/supabase.js": """const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
module.exports = supabase;
""",
    "utils/redis.js": """const { Redis } = require('@upstash/redis');
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});
module.exports = redis;
""",
    "middleware/auth.js": """const supabase = require('../utils/supabase');

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Fetch user profile to get plan
    const { data: profile } = await supabase
      .from('users')
      .select('plan')
      .eq('id', user.id)
      .single();

    req.user = {
      id: user.id,
      email: user.email,
      plan: profile?.plan || 'free',
    };

    next();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = requireAuth;
""",
    "middleware/planCheck.js": """const planCheck = (requiredPlan) => {
  return (req, res, next) => {
    const plans = { 'free': 0, 'pro': 1, 'agency': 2 };
    const userPlan = req.user?.plan || 'free';
    
    if (plans[userPlan] < plans[requiredPlan]) {
      return res.status(403).json({
        success: false,
        message: 'Plan required',
        required_plan: requiredPlan,
        upgrade_url: '/dashboard/settings?tab=billing'
      });
    }
    next();
  };
};

module.exports = planCheck;
""",
    "middleware/rateLimit.js": """const rateLimit = require('express-rate-limit');

const generalLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1000,
  message: {
    success: false,
    message: 'Rate limit exceeded',
  }
});

const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: (req, res) => {
    return req.user?.plan === 'pro' || req.user?.plan === 'agency' ? 100 : 10;
  },
  message: {
    success: false,
    message: 'AI Rate limit exceeded',
    upgrade_message: 'Upgrade to Pro for higher limits'
  }
});

module.exports = { generalLimiter, aiLimiter };
""",
    "middleware/validate.js": """const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation error',
      errors: errors.array()
    });
  }
  next();
};

module.exports = validate;
""",
    "middleware/errorHandler.js": """const winston = require('winston');
const { v4: uuidv4 } = require('uuid');

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console()
  ],
});

const errorHandler = (err, req, res, next) => {
  const requestId = uuidv4();
  logger.error({
    message: err.message,
    stack: err.stack,
    requestId,
    path: req.path,
    method: req.method
  });

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    request_id: requestId
  });
};

module.exports = errorHandler;
""",
    "middleware/cors.js": """const cors = require('cors');

const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
};

module.exports = cors(corsOptions);
""",
    "cron/jobs.js": """const cron = require('node-cron');
// Schedule jobs here
// Example:
// cron.schedule('0 2 * * *', () => {
//   console.log('Running daily tasks at 2:00 AM');
// });
"""
}

# Create route stubs
routes = [
    'auth', 'user', 'onboarding', 'data', 'dashboard', 'products', 
    'profit', 'ai', 'inventory', 'competitors', 'pricing', 'reports', 'billing'
]

for route in routes:
    files_to_create[f"routes/{route}.routes.js"] = f"""const express = require('express');
const router = express.Router();
const controller = require('../controllers/{route}.controller');
const requireAuth = require('../middleware/auth');

module.exports = router;
"""
    files_to_create[f"controllers/{route}.controller.js"] = """
// Controller methods here
"""

for file_path, content in files_to_create.items():
    full_path = os.path.join(base_dir, file_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w") as f:
        f.write(content)

print("Scaffold complete")
