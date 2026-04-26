const express = require('express');
const router = express.Router();
const controller = require('../controllers/data.controller');
const requireAuth = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/upload-csv', requireAuth, upload.single('file'), controller.uploadCsv);
router.get('/import-status/:batchId', requireAuth, controller.importStatus);
router.delete('/clear', requireAuth, controller.clearData);
router.get('/export', requireAuth, controller.exportData);

module.exports = router;
