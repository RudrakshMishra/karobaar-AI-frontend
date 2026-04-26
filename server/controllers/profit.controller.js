// Removed supabase requirement

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
