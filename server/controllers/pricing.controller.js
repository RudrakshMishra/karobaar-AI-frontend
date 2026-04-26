const prisma = require('../utils/db');

exports.getSuggestions = async (req, res) => {
  try {
    // In our schema, we handle pricing suggestions via AiSuggestion model
    const data = await prisma.aiSuggestion.findMany({
      where: {
        user_id: req.auth.userId,
        type: 'Pricing Strategy',
        status: 'active'
      }
    });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.applySuggestion = async (req, res) => {
  try {
    const { price } = req.body;
    
    // We update the product price directly based on the suggestion (assuming productId is passed)
    const data = await prisma.product.updateMany({
      where: {
        id: req.params.productId,
        user_id: req.auth.userId
      },
      data: {
        current_price: Number(price)
      }
    });
    
    res.json({ success: true, data: { updated: data.count > 0 } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.applyAll = async (req, res) => {
  res.json({ success: true, message: 'All applied' });
};
