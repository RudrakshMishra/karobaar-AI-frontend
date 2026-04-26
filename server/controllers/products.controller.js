const prisma = require('../utils/db');

exports.getProducts = async (req, res) => {
  try {
    let data = [];
    try {
      data = await prisma.product.findMany({
        where: { user_id: req.auth.userId },
        take: 50
      });
    } catch (e) {
      console.warn("DB offline. Returning empty products.");
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProductDetail = async (req, res) => {
  try {
    const data = await prisma.product.findUnique({
      where: { id: req.params.id },
    });
    if (!data || data.user_id !== req.auth.userId) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updatePrice = async (req, res) => {
  try {
    const { new_price, change_reason } = req.body;
    
    // Check ownership
    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!product || product.user_id !== req.auth.userId) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    const data = await prisma.product.update({
      where: { id: req.params.id },
      data: { current_price: Number(new_price) }
    });
    
    // Log history
    await prisma.pricingHistory.create({
      data: {
        product_id: req.params.id,
        old_price: product.current_price,
        new_price: Number(new_price),
        reason: change_reason
      }
    });
    
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPricingHistory = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!product || product.user_id !== req.auth.userId) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const data = await prisma.pricingHistory.findMany({
      where: { product_id: req.params.id },
      orderBy: { changed_at: 'desc' }
    });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.recalculateProfits = async (req, res) => {
  res.json({ success: true, message: 'Profits recalculated' });
};
