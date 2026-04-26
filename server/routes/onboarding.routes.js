const express = require('express');
const router = express.Router();
const controller = require('../controllers/onboarding.controller');
const requireAuth = require('../middleware/auth');

router.post('/complete', requireAuth, controller.complete);

module.exports = router;
