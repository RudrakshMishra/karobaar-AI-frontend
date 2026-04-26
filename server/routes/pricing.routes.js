const express = require('express');
const router = express.Router();
const controller = require('../controllers/pricing.controller');
const requireAuth = require('../middleware/auth');

router.get('/suggestions', requireAuth, controller.getSuggestions);
router.put('/apply/:productId', requireAuth, controller.applySuggestion);
router.post('/apply-all', requireAuth, controller.applyAll);

module.exports = router;
