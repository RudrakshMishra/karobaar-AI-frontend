const prisma = require('../utils/db');

exports.getWeeklyDigest = async (req, res) => {
  res.json({ success: true, data: {} });
};

exports.getMonthly = async (req, res) => {
  res.json({ success: true, data: {} });
};

exports.downloadPdf = async (req, res) => {
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="report.pdf"');
  res.send('%PDF-1.4');
};
