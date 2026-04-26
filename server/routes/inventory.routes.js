const express = require('express');
const router = express.Router();
const controller = require('../controllers/inventory.controller');
const requireAuth = require('../middleware/auth');

router.get('/', requireAuth, controller.getInventory);
router.get('/alerts', requireAuth, controller.getAlerts);
router.put('/:productId/restock', requireAuth, controller.restock);
router.get('/export-reorder-list', requireAuth, controller.exportReorderList);
router.post('/ai-reorder-plan', requireAuth, controller.aiReorderPlan);

module.exports = router;
