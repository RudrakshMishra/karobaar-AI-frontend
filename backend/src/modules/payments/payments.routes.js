const express = require('express');
const paymentsController = require('./payments.controller');
const { protect } = require('../../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/create-order', paymentsController.createOrder);
router.post('/verify', paymentsController.verifyPayment);
router.get('/history', paymentsController.getHistory);
router.post('/cancel', paymentsController.cancelSubscription);

module.exports = router;
