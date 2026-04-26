const prisma = require('../utils/db');
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
    const userId = req.auth.userId;
    const user = await prisma.user.findUnique({ where: { clerk_id: userId } });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    await prisma.order.deleteMany({ where: { user_id: user.id } });
    await prisma.product.deleteMany({ where: { user_id: user.id } });
    
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
