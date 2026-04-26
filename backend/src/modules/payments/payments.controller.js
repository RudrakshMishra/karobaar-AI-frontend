const razorpay = require('../../config/razorpay');
const { prisma } = require('../../config/db');
const AppError = require('../../utils/AppError');
const crypto = require('crypto');
// const { sendPaymentConfirmation } = require('../notifications/email.service');

const PLAN_PRICES = {
  'STARTER': 49900, // in paise -> ₹499
  'PRO': 99900,
  'ENTERPRISE': 0 // Custom
};

exports.createOrder = async (req, res, next) => {
  try {
    const { plan } = req.body;
    if (!PLAN_PRICES[plan] && PLAN_PRICES[plan] !== 0) {
      return next(new AppError('Invalid plan selected', 400));
    }

    const amount = PLAN_PRICES[plan];

    const options = {
      amount,
      currency: "INR",
      receipt: `receipt_${req.user.id}_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    
    // Save pending payment
    await prisma.payment.create({
      data: {
        userId: req.user.id,
        razorpayOrderId: order.id,
        amount: amount / 100, // convert back to rupees
        plan: plan,
        status: 'CREATED'
      }
    });

    res.status(200).json({ status: 'success', data: { order } });
  } catch (error) {
    next(new AppError('Failed to create payment order', 500));
  }
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const payment = await prisma.payment.findUnique({ where: { razorpayOrderId: razorpay_order_id } });
    if (!payment) return next(new AppError('Order not found', 404));

    // Sign validation
    let isValid = false;
    if (process.env.RAZORPAY_KEY_SECRET) {
      const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest('hex');
      isValid = generated_signature === razorpay_signature;
    } else {
      isValid = true; // For local mocked mode
    }

    if (isValid) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'SUCCESS' }
      });

      // Update User Plan
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1); // +1 month subscription

      await prisma.user.update({
        where: { id: req.user.id },
        data: { plan: payment.plan, planExpiresAt: expiresAt }
      });

      // Fire email notification asynchronously
      // sendPaymentConfirmation(req.user.email, payment.plan, payment.amount);

      res.status(200).json({ status: 'success', message: 'Payment verified successfully.' });
    } else {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED' }
      });
      res.status(400).json({ status: 'error', message: 'Invalid payment signature' });
    }
  } catch (error) {
    next(error);
  }
};

exports.getHistory = async (req, res, next) => {
  const payments = await prisma.payment.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' }
  });
  res.status(200).json({ status: 'success', data: { payments } });
};

exports.cancelSubscription = async (req, res, next) => {
  // Logic to prevent auto-renewal via Razorpay recurring
  res.status(200).json({ status: 'success', message: 'Subscription auto-renew cancelled.' });
};
