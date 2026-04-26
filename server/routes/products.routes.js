const express = require('express');
const router = express.Router();
const controller = require('../controllers/products.controller');
const requireAuth = require('../middleware/auth');

router.get('/', requireAuth, controller.getProducts);
router.get('/:id', requireAuth, controller.getProductDetail);
router.put('/:id/price', requireAuth, controller.updatePrice);
router.get('/:id/history', requireAuth, controller.getPricingHistory);
router.post('/recalculate-profits', requireAuth, controller.recalculateProfits);

module.exports = router;
