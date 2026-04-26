const express = require('express');
const router = express.Router();
const controller = require('../controllers/profit.controller');
const requireAuth = require('../middleware/auth');

router.post('/calculate', requireAuth, controller.calculate);
router.post('/save-to-product', requireAuth, controller.saveToProduct);
router.post('/apply-to-all', requireAuth, controller.applyToAll);

module.exports = router;
