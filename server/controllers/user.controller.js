const prisma = require('../utils/db');

exports.getProfile = async (req, res) => {
  try {
    const profile = await prisma.user.findUnique({
      where: { clerk_id: req.auth.userId },
      include: { onboarding: true }
    });
    
    if (!profile) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { full_name, store_name } = req.body;
    const data = await prisma.user.update({
      where: { clerk_id: req.auth.userId },
      data: { full_name, store_name }
    });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCostDefaults = async (req, res) => {
  try {
    // This assumes OnboardingProfile handles cost defaults
    const user = await prisma.user.findUnique({ where: { clerk_id: req.auth.userId } });
    const { gst_percent, return_rate_percent, shipping_cost } = req.body;
    
    const data = await prisma.onboardingProfile.upsert({
      where: { user_id: user.id },
      update: { gst_percent, return_rate_percent, shipping_cost },
      create: {
        user_id: user.id,
        gst_percent,
        return_rate_percent,
        shipping_cost
      }
    });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateGoals = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { clerk_id: req.auth.userId } });
    const { monthly_revenue_goal, profit_goal } = req.body;
    
    const data = await prisma.onboardingProfile.upsert({
      where: { user_id: user.id },
      update: { monthly_revenue: String(monthly_revenue_goal), profit_goal: String(profit_goal) },
      create: {
        user_id: user.id,
        monthly_revenue: String(monthly_revenue_goal),
        profit_goal: String(profit_goal)
      }
    });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mocking notifications for now as they are not in the current Prisma schema
exports.getNotifications = async (req, res) => {
  res.json({ success: true, data: [] });
};

exports.markNotificationRead = async (req, res) => {
  res.json({ success: true, data: {} });
};

exports.markAllNotificationsRead = async (req, res) => {
  res.json({ success: true, data: {} });
};
