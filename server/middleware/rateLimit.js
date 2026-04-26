const rateLimit = require('express-rate-limit');

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
