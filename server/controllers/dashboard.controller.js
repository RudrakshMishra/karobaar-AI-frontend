const prisma = require('../utils/db');
const redis = require('../utils/redis');

exports.getSummary = async (req, res) => {
  try {
    const period = req.query.period || '30d';
    const cacheKey = `dashboard:summary:${req.auth.userId}:${period}`;
    
    // Try cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      // Ensure we parse the string back into an object before sending
      const parsedData = typeof cached === 'string' ? JSON.parse(cached) : cached;
      return res.json({ success: true, data: parsedData });
    }
    
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
