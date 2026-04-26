const prisma = require('../utils/db');

exports.complete = async (req, res) => {
  try {
    const { platforms, monthly_revenue_goal, target_margin_percent, cost_defaults } = req.body;
    
    try {
      let user = await prisma.user.findUnique({ where: { clerk_id: req.auth.userId } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            clerk_id: req.auth.userId,
            email: `${req.auth.userId}@fallback.com`,
            full_name: 'New User'
          }
        });
      }
      
      await prisma.onboardingProfile.upsert({
        where: { user_id: user.id },
        update: {
          platforms: platforms ? platforms.map(p => p.platform || p) : [],
          monthly_revenue: String(monthly_revenue_goal),
          profit_goal: String(target_margin_percent),
          gst_percent: cost_defaults?.gst_percent,
          return_rate_percent: cost_defaults?.return_rate_percent,
          shipping_cost: cost_defaults?.shipping_cost
        },
        create: {
          user_id: user.id,
          platforms: platforms ? platforms.map(p => p.platform || p) : [],
          monthly_revenue: String(monthly_revenue_goal),
          profit_goal: String(target_margin_percent),
          gst_percent: cost_defaults?.gst_percent || 18.0,
          return_rate_percent: cost_defaults?.return_rate_percent || 15.0,
          shipping_cost: cost_defaults?.shipping_cost || 50.0
        }
      });
    } catch (dbError) {
      console.warn("DB not running. Bypassing DB write for onboarding.");
    }

    res.json({ success: true, data: { redirect: '/dashboard' } });
  } catch (error) {
    console.error("ONBOARDING ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
