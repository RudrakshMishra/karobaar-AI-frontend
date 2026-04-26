const prisma = require('../utils/db');

exports.getInventory = async (req, res) => {
  try {
    const data = await prisma.product.findMany({
      where: { user_id: req.auth.userId },
      orderBy: { current_stock: 'asc' }
    });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAlerts = async (req, res) => {
  try {
    const data = await prisma.product.findMany({
      where: {
        user_id: req.auth.userId,
        current_stock: { lte: 20 } // Threshold for low stock
      }
    });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.restock = async (req, res) => {
  try {
    const { quantity_added } = req.body;
    const product = await prisma.product.findUnique({
      where: { id: req.params.productId }
    });
    
    if (!product || product.user_id !== req.auth.userId) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    const newStock = (product.current_stock || 0) + quantity_added;
    const data = await prisma.product.update({
      where: { id: req.params.productId },
      data: { current_stock: newStock }
    });
    
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
