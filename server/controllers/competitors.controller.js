const prisma = require('../utils/db');

exports.getCompetitors = async (req, res) => {
  try {
    const data = await prisma.competitorLink.findMany({
      where: { user_id: req.auth.userId },
      include: { product: true }
    });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addCompetitor = async (req, res) => {
  try {
    const { product_id, competitor_url, platform } = req.body;
    const data = await prisma.competitorLink.create({
      data: {
        user_id: req.auth.userId,
        product_id,
        url: competitor_url,
        platform,
        last_checked_price: 999
      }
    });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.refreshCompetitor = async (req, res) => {
  try {
    const data = await prisma.competitorLink.updateMany({
      where: {
        id: req.params.id,
        user_id: req.auth.userId
      },
      data: {
        last_checked_at: new Date()
      }
    });
    res.json({ success: true, data: { updated: data.count > 0 } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteCompetitor = async (req, res) => {
  try {
    const data = await prisma.competitorLink.deleteMany({
      where: {
        id: req.params.id,
        user_id: req.auth.userId
      }
    });
    res.json({ success: true, message: 'Competitor tracking removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
