const Razorpay = require('razorpay');

let razorpay;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
} else {
  console.warn('⚠️ Razorpay credentials missing. Payment module will run in mock mode.');
  // Mock instance for local testing without keys
  razorpay = {
    orders: {
      create: async (opts) => ({ id: `order_mock_${Date.now()}`, ...opts })
    }
  };
}

module.exports = razorpay;
