const express = require('express');
const router = express.Router();
const controller = require('../controllers/competitors.controller');
const requireAuth = require('../middleware/auth');

router.get('/', requireAuth, controller.getCompetitors);
router.post('/add', requireAuth, controller.addCompetitor);
router.put('/:id/refresh', requireAuth, controller.refreshCompetitor);
router.delete('/:id', requireAuth, controller.deleteCompetitor);

module.exports = router;
