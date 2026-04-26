import os

base_dir = r"c:\Users\Asus\.gemini\antigravity\scratch\karobaar-ai\server\controllers"

controllers = {
    "auth.controller.js": """const supabase = require('../utils/supabase');
const bcrypt = require('bcryptjs');

exports.signup = async (req, res) => {
  try {
    const { email, password, full_name, business_type } = req.body;
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name } }
    });

    if (authError) return res.status(400).json({ success: false, message: authError.message });
    
    // Auth trigger usually creates user, but let's be explicit if needed
    // Assuming Supabase auth is enough
    
    res.json({ success: true, data: { user: authData.user, session: authData.session, access_token: authData.session?.access_token } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) return res.status(400).json({ success: false, message: error.message });
    
    const { data: profile } = await supabase.from('users').select('*').eq('id', data.user.id).single();
    
    res.json({ success: true, data: { user: data.user, access_token: data.session.access_token, plan: profile?.plan || 'free' } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.google = async (req, res) => {
  try {
    const { id_token } = req.body;
    const { data, error } = await supabase.auth.signInWithIdToken({ provider: 'google', token: id_token });
    
    if (error) return res.status(400).json({ success: false, message: error.message });
    res.json({ success: true, data: { user: data.user, access_token: data.session.access_token } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.logout = async (req, res) => {
  const { error } = await supabase.auth.signOut();
  if (error) return res.status(400).json({ success: false, message: error.message });
  res.json({ success: true, message: 'Logged out successfully' });
};

exports.me = async (req, res) => {
  try {
    const { data: profile, error } = await supabase.from('users').select('*').eq('id', req.user.id).single();
    if (error) return res.status(400).json({ success: false, message: error.message });
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.refresh = async (req, res) => {
  const { data, error } = await supabase.auth.refreshSession();
  if (error) return res.status(400).json({ success: false, message: error.message });
  res.json({ success: true, data });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) return res.status(400).json({ success: false, message: error.message });
  res.json({ success: true, message: 'Password reset email sent' });
};

exports.resetPassword = async (req, res) => {
  const { new_password } = req.body;
  const { error } = await supabase.auth.updateUser({ password: new_password });
  if (error) return res.status(400).json({ success: false, message: error.message });
  res.json({ success: true, message: 'Password updated successfully' });
};
""",
    "user.controller.js": """const supabase = require('../utils/supabase');

exports.getProfile = async (req, res) => {
  try {
    const { data: profile } = await supabase.from('users').select('*').eq('id', req.user.id).single();
    const { data: cost_defaults } = await supabase.from('cost_defaults').select('*').eq('user_id', req.user.id).single();
    const { data: platforms } = await supabase.from('connected_platforms').select('*').eq('user_id', req.user.id);
    
    res.json({ success: true, data: { ...profile, cost_defaults, connected_platforms: platforms } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { full_name, business_name, phone, gst_number } = req.body;
    const { data, error } = await supabase.from('users').update({ full_name, business_name, phone, gst_number }).eq('id', req.user.id).select().single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCostDefaults = async (req, res) => {
  try {
    const { data, error } = await supabase.from('cost_defaults').upsert({ user_id: req.user.id, ...req.body }, { onConflict: 'user_id' }).select().single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateGoals = async (req, res) => {
  try {
    const { monthly_revenue_goal, target_margin_percent, primary_platform } = req.body;
    const { data, error } = await supabase.from('users').update({ monthly_revenue_goal, target_margin_percent, primary_platform }).eq('id', req.user.id).select().single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const { unread_only, limit = 50 } = req.query;
    let query = supabase.from('notifications').select('*').eq('user_id', req.user.id).order('created_at', { ascending: false }).limit(limit);
    if (unread_only === 'true') {
      query = query.eq('is_read', false);
    }
    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    const { data, error } = await supabase.from('notifications').update({ is_read: true }).eq('id', req.params.id).eq('user_id', req.user.id);
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markAllNotificationsRead = async (req, res) => {
  try {
    const { data, error } = await supabase.from('notifications').update({ is_read: true }).eq('user_id', req.user.id);
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
""",
    "onboarding.controller.js": """const supabase = require('../utils/supabase');

exports.complete = async (req, res) => {
  try {
    const { platforms, monthly_revenue_goal, target_margin_percent, cost_defaults } = req.body;
    
    // Update user
    await supabase.from('users').update({
      monthly_revenue_goal,
      target_margin_percent,
      onboarding_completed: true
    }).eq('id', req.user.id);
    
    // Upsert cost defaults
    if (cost_defaults) {
      await supabase.from('cost_defaults').upsert({ user_id: req.user.id, ...cost_defaults }, { onConflict: 'user_id' });
    }
    
    // Insert platforms
    if (platforms && platforms.length > 0) {
      const platformData = platforms.map(p => ({ user_id: req.user.id, ...p }));
      await supabase.from('connected_platforms').insert(platformData);
    }
    
    // Send welcome notification
    await supabase.from('notifications').insert({
      user_id: req.user.id,
      type: 'info',
      title: 'Welcome to Karobaar AI!',
      body: 'Your onboarding is complete. Time to grow your business.'
    });

    res.json({ success: true, data: { redirect: '/dashboard' } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
""",
    "dashboard.controller.js": """const supabase = require('../utils/supabase');
const redis = require('../utils/redis');

exports.getSummary = async (req, res) => {
  try {
    const period = req.query.period || '30d';
    const cacheKey = `dashboard:summary:${req.user.id}:${period}`;
    
    // Try cache first
    const cached = await redis.get(cacheKey);
    if (cached) return res.json({ success: true, data: cached });
    
    // Mocking real computation for now - in reality this would aggregate from orders table
    const data = {
      kpis: {
        total_revenue: 1250000,
        revenue_change_percent: 12.5,
        net_profit: 250000,
        profit_change_percent: 5.2,
        total_orders: 1250,
        orders_change_percent: 8.1,
        avg_order_value: 1000,
        aov_change_percent: 2.1,
        return_rate_percent: 15,
        return_rate_change_percent: -1.5
      },
      revenue_chart: [
        { date: '2026-04-01', revenue: 40000, profit: 8000 },
        { date: '2026-04-02', revenue: 45000, profit: 9000 },
        { date: '2026-04-03', revenue: 42000, profit: 8500 },
      ],
      top_products: [
        { name: 'Wireless Earbuds', revenue: 150000, units_sold: 150, net_profit: 30000, margin_percent: 20, return_rate_percent: 12, trend: 'up' },
        { name: 'Smart Watch', revenue: 120000, units_sold: 60, net_profit: 24000, margin_percent: 20, return_rate_percent: 10, trend: 'up' },
      ],
      customer_segments: { champions: 150, loyal: 300, at_risk: 100, lost: 50, new_customers: 200 },
      platform_breakdown: [
        { platform: 'amazon', revenue: 600000, orders: 600, percent: 48 },
        { platform: 'flipkart', revenue: 400000, orders: 400, percent: 32 },
        { platform: 'shopify', revenue: 250000, orders: 250, percent: 20 }
      ],
      goal_progress: {
        goal: 1500000,
        current: 1250000,
        percent: 83.3,
        days_remaining: 5,
        required_daily: 50000
      }
    };
    
    await redis.setex(cacheKey, 300, JSON.stringify(data));
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getHealthScore = async (req, res) => {
  try {
    const data = {
      overall_score: 85,
      profit_score: 90,
      marketing_score: 80,
      pricing_score: 85,
      inventory_score: 85,
      calculated_at: new Date().toISOString()
    };
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
"""
}

for file_name, content in controllers.items():
    with open(os.path.join(base_dir, file_name), "w") as f:
        f.write(content)

# Generate route files
routes_dir = r"c:\Users\Asus\.gemini\antigravity\scratch\karobaar-ai\server\routes"

routes = {
    "auth.routes.js": """const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');
const requireAuth = require('../middleware/auth');

router.post('/signup', controller.signup);
router.post('/login', controller.login);
router.post('/google', controller.google);
router.post('/logout', requireAuth, controller.logout);
router.post('/refresh', requireAuth, controller.refresh);
router.get('/me', requireAuth, controller.me);
router.post('/forgot-password', controller.forgotPassword);
router.post('/reset-password', controller.resetPassword);

module.exports = router;
""",
    "user.routes.js": """const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');
const requireAuth = require('../middleware/auth');

router.get('/profile', requireAuth, controller.getProfile);
router.put('/profile', requireAuth, controller.updateProfile);
router.put('/cost-defaults', requireAuth, controller.updateCostDefaults);
router.put('/goals', requireAuth, controller.updateGoals);
router.get('/notifications', requireAuth, controller.getNotifications);
router.put('/notifications/read-all', requireAuth, controller.markAllNotificationsRead);
router.put('/notifications/:id/read', requireAuth, controller.markNotificationRead);

module.exports = router;
""",
    "onboarding.routes.js": """const express = require('express');
const router = express.Router();
const controller = require('../controllers/onboarding.controller');
const requireAuth = require('../middleware/auth');

router.post('/complete', requireAuth, controller.complete);

module.exports = router;
""",
    "dashboard.routes.js": """const express = require('express');
const router = express.Router();
const controller = require('../controllers/dashboard.controller');
const requireAuth = require('../middleware/auth');

router.get('/summary', requireAuth, controller.getSummary);
router.get('/health-score', requireAuth, controller.getHealthScore);

module.exports = router;
"""
}

for file_name, content in routes.items():
    with open(os.path.join(routes_dir, file_name), "w") as f:
        f.write(content)

print("Controllers and routes generated")
