const express = require('express');
const router = express.Router();
const controller = require('../controllers/ai.controller');
const requireAuth = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimit');

router.post('/copilot', requireAuth, aiLimiter, controller.copilot);
router.post('/chat', requireAuth, aiLimiter, controller.chat);
router.get('/suggestions', requireAuth, controller.getSuggestions);
router.post('/generate', requireAuth, aiLimiter, controller.generateSuggestions);
router.put('/suggestions/:id/apply', requireAuth, controller.applySuggestion);
router.put('/suggestions/:id/dismiss', requireAuth, controller.dismissSuggestion);
router.post('/pricing-suggestions', requireAuth, controller.pricingSuggestions);
router.post('/weekly-digest', requireAuth, controller.weeklyDigest);

module.exports = router;
