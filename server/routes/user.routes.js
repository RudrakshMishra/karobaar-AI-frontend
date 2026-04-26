const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');
const requireAuth = require('../middleware/auth');

router.get('/profile', requireAuth, controller.getProfile);
router.put('/profile', requireAuth, controller.updateProfile);
router.put('/cost-defaults', requireAuth, controller.updateCostDefaults);
router.put('/goals', requireAuth, controller.updateGoals);
router.get('/notifications', requireAuth, controller.getNotifications);
router.put('/notifications/read-all', requireAuth, controller.markAllNotificationsRead);
router.put('/notifications/:id/read', requireAuth, controller.markNotificationRead);

module.exports = router;
