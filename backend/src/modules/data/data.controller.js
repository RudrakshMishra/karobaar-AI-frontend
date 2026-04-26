const { prisma } = require('../../config/db');
const AppError = require('../../utils/AppError');
const csvParser = require('./csv.parser');
// const { analyticsQueue } = require('../../jobs/queue'); // We will create this later

exports.uploadCSVFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError('Please provide a CSV file', 400));
    }

    const platform = req.body.platform || 'generic';

    // 1. Create DataUpload record
    const uploadRecord = await prisma.dataUpload.create({
      data: {
        userId: req.user.id,
        filename: req.file.filename,
        platform,
        status: 'PROCESSING'
      }
    });

    // 2. Parse and save rows
    try {
      const parsedData = await csvParser.processCSV(req.file.path, req.user.id, uploadRecord.id, platform);
      
      // Update record
      await prisma.dataUpload.update({
        where: { id: uploadRecord.id },
        data: { status: 'COMPLETED', rowCount: parsedData.length }
      });

      // 3. Trigger analytics queue (commented out until queue is built)
      // await analyticsQueue.add('computeAnalytics', { userId: req.user.id });

      res.status(200).json({
        status: 'success',
        data: {
          success: true,
          rowsProcessed: parsedData.length,
          preview: parsedData.slice(0, 5) // Return first 5 rows
        }
      });
    } catch (parseError) {
      await prisma.dataUpload.update({
        where: { id: uploadRecord.id },
        data: { status: 'FAILED' }
      });
      throw new AppError(`CSV parsing failed: ${parseError.message}`, 400);
    }
  } catch (error) {
    next(error);
  }
};

exports.getUploadHistory = async (req, res, next) => {
  const history = await prisma.dataUpload.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' }
  });
  
  res.status(200).json({ status: 'success', data: { history } });
};

exports.deleteUpload = async (req, res, next) => {
  const upload = await prisma.dataUpload.findUnique({ where: { id: req.params.id } });
  if (!upload || upload.userId !== req.user.id) {
    return next(new AppError('Upload not found', 404));
  }

  // Delete related orders via cascade (if setup) or manual
  // For generic relation: 
  await prisma.order.deleteMany({ where: { uploadId: upload.id } });
  await prisma.dataUpload.delete({ where: { id: upload.id } });

  res.status(204).json({ status: 'success', data: null });
};

// Stubbing connections endpoints
exports.connectShopify = async (req, res, next) => { res.status(200).json({ status: 'success', message: 'Shopify connected' }); }
exports.connectAmazon = async (req, res, next) => { res.status(200).json({ status: 'success', message: 'Amazon connected' }); }
exports.connectFlipkart = async (req, res, next) => { res.status(200).json({ status: 'success', message: 'Flipkart connected' }); }
exports.getConnections = async (req, res, next) => { res.status(200).json({ status: 'success', data: [] }); }
exports.deleteConnection = async (req, res, next) => { res.status(204).json({ status: 'success', data: null }); }
