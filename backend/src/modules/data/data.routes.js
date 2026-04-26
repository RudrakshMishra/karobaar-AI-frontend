const express = require('express');
const dataController = require('./data.controller');
const { protect } = require('../../middleware/auth');
const { uploadCSV } = require('../../middleware/upload');

const router = express.Router();

router.use(protect);

router.post('/upload-csv', uploadCSV.single('file'), dataController.uploadCSVFile);
router.get('/upload-history', dataController.getUploadHistory);
router.delete('/upload/:id', dataController.deleteUpload);

router.post('/connect/shopify', dataController.connectShopify);
router.post('/connect/amazon', dataController.connectAmazon);
router.post('/connect/flipkart', dataController.connectFlipkart);
router.get('/connections', dataController.getConnections);
router.delete('/connections/:id', dataController.deleteConnection);

module.exports = router;
