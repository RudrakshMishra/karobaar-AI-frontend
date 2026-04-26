const express = require('express');
const router = express.Router();
const webhooksController = require('../controllers/webhooks.controller');

// Need raw body for Stripe/Clerk webhooks
router.post('/clerk', express.raw({ type: 'application/json' }), webhooksController.clerkWebhook);

module.exports = router;
