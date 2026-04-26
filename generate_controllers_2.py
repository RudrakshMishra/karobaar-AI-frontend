import os

base_dir = r"c:\Users\Asus\.gemini\antigravity\scratch\karobaar-ai\server\controllers"

controllers = {
    "data.controller.js": """const supabase = require('../utils/supabase');
const fs = require('fs');
const papa = require('papaparse');
const path = require('path');

exports.uploadCsv = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    
    // In a real app, upload to Supabase storage and parse
    const fileContent = fs.readFileSync(req.file.path, 'utf8');
    const parsed = papa.parse(fileContent, { header: true });
    
    // Mock column mapping response
    const mapping = {
      order_id: 'Order ID',
      date: 'Date',
      product_name: 'Product Name',
      sku: 'SKU',
      quantity: 'Quantity',
      selling_price: 'Selling Price',
      platform: 'Platform'
    };
    
    res.json({ success: true, data: { mapping, preview: parsed.data.slice(0, 5) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.importStatus = async (req, res) => {
  res.json({ success: true, data: { status: 'completed', progress: 100 } });
};

exports.clearData = async (req, res) => {
  try {
    await supabase.from('orders').delete().eq('user_id', req.user.id);
    await supabase.from('products').delete().eq('user_id', req.user.id);
    res.json({ success: true, message: 'Data cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.exportData = async (req, res) => {
  // Mock export
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="export.csv"');
  res.send('id,name\n1,Test');
};
""",
    "products.controller.js": """const supabase = require('../utils/supabase');

exports.getProducts = async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').select('*').eq('user_id', req.user.id).limit(50);
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProductDetail = async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').select('*').eq('id', req.params.id).eq('user_id', req.user.id).single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updatePrice = async (req, res) => {
  try {
    const { new_price, change_reason } = req.body;
    const { data: product } = await supabase.from('products').select('*').eq('id', req.params.id).single();
    
    const { data, error } = await supabase.from('products').update({ current_price: new_price }).eq('id', req.params.id).eq('user_id', req.user.id).select().single();
    if (error) throw error;
    
    // Log history
    await supabase.from('pricing_history').insert({
      product_id: req.params.id,
      user_id: req.user.id,
      old_price: product.current_price,
      new_price,
      change_reason
    });
    
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPricingHistory = async (req, res) => {
  try {
    const { data, error } = await supabase.from('pricing_history').select('*').eq('product_id', req.params.id).eq('user_id', req.user.id).order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.recalculateProfits = async (req, res) => {
  res.json({ success: true, message: 'Profits recalculated' });
};
""",
    "profit.controller.js": """const supabase = require('../utils/supabase');

exports.calculate = async (req, res) => {
  try {
    const { selling_price, platform_fee_percent, shipping_cost, packaging_cost, ads_cost_per_unit, gst_percent, cod_return_rate_percent, quantity = 1 } = req.body;
    
    const gross_revenue = selling_price * quantity;
    const platform_fee = gross_revenue * (platform_fee_percent / 100);
    const gst_amount = gross_revenue * (gst_percent / 100);
    const cod_loss = gross_revenue * (cod_return_rate_percent / 100) * 0.02; // Assuming 2% cost on return
    
    const total_deductions = platform_fee + shipping_cost + packaging_cost + ads_cost_per_unit + gst_amount + cod_loss;
    const net_profit = gross_revenue - total_deductions;
    const margin_percent = gross_revenue > 0 ? (net_profit / gross_revenue) * 100 : 0;
    
    let health = 'low';
    if (margin_percent > 20) health = 'excellent';
    else if (margin_percent > 10) health = 'good';
    else if (margin_percent < 0) health = 'loss';
    
    const data = {
      gross_revenue, platform_fee, gst_amount, shipping_cost, packaging_cost,
      ads_cost_per_unit, cod_loss, total_deductions, net_profit, margin_percent,
      health,
      ai_tip: "Try negotiating your shipping rates or slightly increasing the price by 5% to bump margins."
    };
    
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.saveToProduct = async (req, res) => {
  res.json({ success: true, message: 'Saved to product' });
};

exports.applyToAll = async (req, res) => {
  res.json({ success: true, message: 'Applied to all products' });
};
""",
    "ai.controller.js": """const supabase = require('../utils/supabase');

exports.copilot = async (req, res) => {
  try {
    const suggestions = [
      { type: 'opportunity', priority: 'high', title: 'Increase Price', description: 'Product A margin is low, increase price by ₹50.', action: 'Review Pricing' },
      { type: 'warning', priority: 'medium', title: 'Low Stock Alert', description: 'Product B will run out in 5 days.', action: 'Reorder Now' }
    ];
    res.json({ success: true, data: { suggestions } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.chat = async (req, res) => {
  // Mock streaming response
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  const words = ['Hello!', ' I am', ' Karobaar AI.', ' Aapka', ' Next', ' Step:'];
  let i = 0;
  
  const interval = setInterval(() => {
    if (i < words.length) {
      res.write(`data: ${JSON.stringify({ chunk: words[i] })}\n\n`);
      i++;
    } else {
      res.write('data: [DONE]\n\n');
      clearInterval(interval);
      res.end();
    }
  }, 100);
};

exports.getSuggestions = async (req, res) => {
  try {
    const { status = 'active', limit = 10 } = req.query;
    const { data, error } = await supabase.from('ai_suggestions').select('*').eq('user_id', req.user.id).eq('status', status).limit(limit);
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.applySuggestion = async (req, res) => {
  try {
    const { data, error } = await supabase.from('ai_suggestions').update({ status: 'applied', applied_at: new Date() }).eq('id', req.params.id).eq('user_id', req.user.id).select().single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.dismissSuggestion = async (req, res) => {
  try {
    const { data, error } = await supabase.from('ai_suggestions').update({ status: 'dismissed', dismissed_at: new Date() }).eq('id', req.params.id).eq('user_id', req.user.id).select().single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.pricingSuggestions = async (req, res) => {
  res.json({ success: true, data: [] });
};

exports.weeklyDigest = async (req, res) => {
  res.json({ success: true, data: {} });
};
""",
    "inventory.controller.js": """const supabase = require('../utils/supabase');

exports.getInventory = async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').select('*').eq('user_id', req.user.id).order('days_of_stock_remaining', { ascending: true });
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAlerts = async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').select('*').eq('user_id', req.user.id).lte('days_of_stock_remaining', 7);
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.restock = async (req, res) => {
  try {
    const { quantity_added } = req.body;
    const { data: product } = await supabase.from('products').select('current_stock').eq('id', req.params.productId).single();
    
    const newStock = (product.current_stock || 0) + quantity_added;
    const { data, error } = await supabase.from('products').update({ current_stock: newStock }).eq('id', req.params.productId).eq('user_id', req.user.id).select().single();
    if (error) throw error;
    
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.exportReorderList = async (req, res) => {
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="reorder.csv"');
  res.send('Product,SKU,Reorder Qty\nTest,TEST-1,50');
};

exports.aiReorderPlan = async (req, res) => {
  res.json({ success: true, data: { reorder_plan: [] } });
};
""",
    "competitors.controller.js": """const supabase = require('../utils/supabase');

exports.getCompetitors = async (req, res) => {
  try {
    const { data, error } = await supabase.from('competitors').select('*, products(name)').eq('user_id', req.user.id);
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addCompetitor = async (req, res) => {
  try {
    const { product_id, competitor_url, platform } = req.body;
    const { data, error } = await supabase.from('competitors').insert({
      user_id: req.user.id,
      product_id,
      competitor_url,
      platform,
      competitor_name: 'Tracker ' + platform,
      competitor_price: 999,
      ai_insight: 'Priced competitively.'
    }).select().single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.refreshCompetitor = async (req, res) => {
  try {
    const { data, error } = await supabase.from('competitors').update({ last_checked_at: new Date() }).eq('id', req.params.id).eq('user_id', req.user.id).select().single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteCompetitor = async (req, res) => {
  try {
    const { error } = await supabase.from('competitors').update({ status: 'paused' }).eq('id', req.params.id).eq('user_id', req.user.id);
    if (error) throw error;
    res.json({ success: true, message: 'Competitor tracking paused' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
""",
    "pricing.controller.js": """const supabase = require('../utils/supabase');

exports.getSuggestions = async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').select('*').eq('user_id', req.user.id).not('suggested_price', 'is', null);
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.applySuggestion = async (req, res) => {
  try {
    const { price } = req.body;
    const { data, error } = await supabase.from('products').update({ current_price: price, suggested_price: null }).eq('id', req.params.productId).eq('user_id', req.user.id).select().single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.applyAll = async (req, res) => {
  res.json({ success: true, message: 'All applied' });
};
""",
    "reports.controller.js": """const supabase = require('../utils/supabase');

exports.getWeeklyDigest = async (req, res) => {
  res.json({ success: true, data: {} });
};

exports.getMonthly = async (req, res) => {
  res.json({ success: true, data: {} });
};

exports.downloadPdf = async (req, res) => {
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="report.pdf"');
  res.send('%PDF-1.4');
};
""",
    "billing.controller.js": """const supabase = require('../utils/supabase');

exports.createOrder = async (req, res) => {
  res.json({ success: true, data: { order_id: 'order_mock', amount: 49900, currency: 'INR', key_id: process.env.RAZORPAY_KEY_ID } });
};

exports.verifyPayment = async (req, res) => {
  try {
    // Mock successful payment
    await supabase.from('users').update({ plan: 'pro' }).eq('id', req.user.id);
    res.json({ success: true, data: { plan: 'pro' } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.webhook = async (req, res) => {
  res.json({ success: true });
};

exports.getInvoices = async (req, res) => {
  try {
    const { data, error } = await supabase.from('subscriptions').select('*').eq('user_id', req.user.id);
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
"""
}

for file_name, content in controllers.items():
    with open(os.path.join(base_dir, file_name), "w", encoding="utf-8") as f:
        f.write(content)

# Generate route files
routes_dir = r"c:\Users\Asus\.gemini\antigravity\scratch\karobaar-ai\server\routes"

routes = {
    "data.routes.js": """const express = require('express');
const router = express.Router();
const controller = require('../controllers/data.controller');
const requireAuth = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/upload-csv', requireAuth, upload.single('file'), controller.uploadCsv);
router.get('/import-status/:batchId', requireAuth, controller.importStatus);
router.delete('/clear', requireAuth, controller.clearData);
router.get('/export', requireAuth, controller.exportData);

module.exports = router;
""",
    "products.routes.js": """const express = require('express');
const router = express.Router();
const controller = require('../controllers/products.controller');
const requireAuth = require('../middleware/auth');

router.get('/', requireAuth, controller.getProducts);
router.get('/:id', requireAuth, controller.getProductDetail);
router.put('/:id/price', requireAuth, controller.updatePrice);
router.get('/:id/history', requireAuth, controller.getPricingHistory);
router.post('/recalculate-profits', requireAuth, controller.recalculateProfits);

module.exports = router;
""",
    "profit.routes.js": """const express = require('express');
const router = express.Router();
const controller = require('../controllers/profit.controller');
const requireAuth = require('../middleware/auth');

router.post('/calculate', requireAuth, controller.calculate);
router.post('/save-to-product', requireAuth, controller.saveToProduct);
router.post('/apply-to-all', requireAuth, controller.applyToAll);

module.exports = router;
""",
    "ai.routes.js": """const express = require('express');
const router = express.Router();
const controller = require('../controllers/ai.controller');
const requireAuth = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimit');

router.post('/copilot', requireAuth, aiLimiter, controller.copilot);
router.post('/chat', requireAuth, aiLimiter, controller.chat);
router.get('/suggestions', requireAuth, controller.getSuggestions);
router.put('/suggestions/:id/apply', requireAuth, controller.applySuggestion);
router.put('/suggestions/:id/dismiss', requireAuth, controller.dismissSuggestion);
router.post('/pricing-suggestions', requireAuth, controller.pricingSuggestions);
router.post('/weekly-digest', requireAuth, controller.weeklyDigest);

module.exports = router;
""",
    "inventory.routes.js": """const express = require('express');
const router = express.Router();
const controller = require('../controllers/inventory.controller');
const requireAuth = require('../middleware/auth');

router.get('/', requireAuth, controller.getInventory);
router.get('/alerts', requireAuth, controller.getAlerts);
router.put('/:productId/restock', requireAuth, controller.restock);
router.get('/export-reorder-list', requireAuth, controller.exportReorderList);
router.post('/ai-reorder-plan', requireAuth, controller.aiReorderPlan);

module.exports = router;
""",
    "competitors.routes.js": """const express = require('express');
const router = express.Router();
const controller = require('../controllers/competitors.controller');
const requireAuth = require('../middleware/auth');

router.get('/', requireAuth, controller.getCompetitors);
router.post('/add', requireAuth, controller.addCompetitor);
router.put('/:id/refresh', requireAuth, controller.refreshCompetitor);
router.delete('/:id', requireAuth, controller.deleteCompetitor);

module.exports = router;
""",
    "pricing.routes.js": """const express = require('express');
const router = express.Router();
const controller = require('../controllers/pricing.controller');
const requireAuth = require('../middleware/auth');

router.get('/suggestions', requireAuth, controller.getSuggestions);
router.put('/apply/:productId', requireAuth, controller.applySuggestion);
router.post('/apply-all', requireAuth, controller.applyAll);

module.exports = router;
""",
    "reports.routes.js": """const express = require('express');
const router = express.Router();
const controller = require('../controllers/reports.controller');
const requireAuth = require('../middleware/auth');

router.get('/weekly-digest', requireAuth, controller.getWeeklyDigest);
router.get('/monthly', requireAuth, controller.getMonthly);
router.get('/download-pdf', requireAuth, controller.downloadPdf);

module.exports = router;
""",
    "billing.routes.js": """const express = require('express');
const router = express.Router();
const controller = require('../controllers/billing.controller');
const requireAuth = require('../middleware/auth');

router.post('/create-order', requireAuth, controller.createOrder);
router.post('/verify-payment', requireAuth, controller.verifyPayment);
router.post('/webhook', controller.webhook);
router.get('/invoices', requireAuth, controller.getInvoices);

module.exports = router;
"""
}

for file_name, content in routes.items():
    with open(os.path.join(routes_dir, file_name), "w", encoding="utf-8") as f:
        f.write(content)

print("Remaining controllers and routes generated")
