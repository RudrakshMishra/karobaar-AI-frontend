const aiService = require('./ai.service');
const { prisma } = require('../../config/db');
const AppError = require('../../utils/AppError');
const redisClient = require('../../config/redis');

exports.getInsights = async (req, res, next) => {
  try {
    // Check cache first to save API costs
    const cacheKey = `insights:${req.user.id}:${new Date().toISOString().split('T')[0]}`;
    const cached = await redisClient.get(cacheKey);
    
    if (cached) {
      return res.status(200).json({ status: 'success', data: { insights: JSON.parse(cached) } });
    }

    // Mock gathering business metrics
    const businessData = {
      name: req.user.businessName || req.user.name,
      revenue: 45000,
      margin: 18.5,
      returnRate: 4.2
    };

    const insightText = await aiService.generateBusinessInsight(businessData);
    
    // Save to DB
    const insightDoc = await prisma.aIInsight.create({
      data: {
        userId: req.user.id,
        type: 'GENERAL',
        content: insightText
      }
    });

    // Cache for 24h
    await redisClient.setex(cacheKey, 86400, JSON.stringify(insightDoc.content));

    res.status(200).json({ status: 'success', data: { insights: insightDoc.content } });
  } catch (error) {
    next(error);
  }
};

exports.getHealthScore = async (req, res, next) => {
  try {
    // Mock metrics
    const metrics = { margin: 22, stockoutRisk: 1 };
    const score = aiService.calculateHealthScore(metrics);

    const savedScore = await prisma.healthScore.create({
      data: {
        userId: req.user.id,
        ...score
      }
    });

    res.status(200).json({ status: 'success', data: { healthScore: savedScore } });
  } catch (error) {
    next(error);
  }
};

exports.chat = async (req, res, next) => { res.status(200).json({ status: 'success', message: 'Chat placeholder' }); };
exports.pricingAdvice = async (req, res, next) => { res.status(200).json({ status: 'success', message: 'Pricing Advice placeholder' }); };
exports.restockAlert = async (req, res, next) => { res.status(200).json({ status: 'success', message: 'Restock Alert placeholder' }); };
exports.marketingCopy = async (req, res, next) => { res.status(200).json({ status: 'success', message: 'Marketing copy placeholder' }); };
