const express = require('express');
const analyticsController = require('./analytics.controller');
const { protect, restrictToPlan } = require('../../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/overview', analyticsController.getOverview);
router.get('/sales', analyticsController.getSales);
router.get('/profit', analyticsController.getProfit);
router.get('/products', analyticsController.getProducts);

// Gated routes for paying tiers
router.use(restrictToPlan('STARTER', 'PRO', 'ENTERPRISE'));
router.get('/customers', analyticsController.getCustomers);
router.get('/inventory', analyticsController.getInventory);
router.get('/returns', analyticsController.getReturns);
router.get('/marketing', analyticsController.getMarketing);

module.exports = router;
