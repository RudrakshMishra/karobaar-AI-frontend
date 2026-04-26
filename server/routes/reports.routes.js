const express = require('express');
const router = express.Router();
const controller = require('../controllers/reports.controller');
const requireAuth = require('../middleware/auth');

router.get('/weekly-digest', requireAuth, controller.getWeeklyDigest);
router.get('/monthly', requireAuth, controller.getMonthly);
router.get('/download-pdf', requireAuth, controller.downloadPdf);

module.exports = router;
