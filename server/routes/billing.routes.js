const express = require('express');
const router = express.Router();
const controller = require('../controllers/billing.controller');
const requireAuth = require('../middleware/auth');

router.post('/create-order', requireAuth, controller.createOrder);
router.post('/verify-payment', requireAuth, controller.verifyPayment);
router.post('/webhook', controller.webhook);
router.get('/invoices', requireAuth, controller.getInvoices);

module.exports = router;
