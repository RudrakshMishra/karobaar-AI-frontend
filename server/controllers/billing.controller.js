const prisma = require('../utils/db');

exports.createOrder = async (req, res) => {
  res.json({ success: true, data: { order_id: 'order_mock', amount: 49900, currency: 'INR', key_id: process.env.RAZORPAY_KEY_ID } });
};

exports.verifyPayment = async (req, res) => {
  try {
    // Mock successful payment
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
    res.json({ success: true, data: [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
