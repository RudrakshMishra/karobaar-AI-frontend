const express = require('express');
const router = express.Router();
const controller = require('../controllers/dashboard.controller');
const requireAuth = require('../middleware/auth');

router.get('/summary', requireAuth, controller.getSummary);
router.get('/health-score', requireAuth, controller.getHealthScore);

module.exports = router;
