const express = require('express');
const aiController = require('./ai.controller');
const { protect, restrictToPlan } = require('../../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/insights', aiController.getInsights);
router.get('/health-score', aiController.getHealthScore);

// Advanced AI features gated behind pro plans
router.use(restrictToPlan('STARTER', 'PRO', 'ENTERPRISE'));
router.post('/chat', aiController.chat);
router.post('/pricing-advice', aiController.pricingAdvice);
router.post('/restock-alert', aiController.restockAlert);
router.post('/marketing-copy', aiController.marketingCopy);

module.exports = router;
