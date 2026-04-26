const openai = require('../../config/openai');
const { prisma } = require('../../config/db');

exports.generateBusinessInsight = async (businessData) => {
  const prompt = `
    You are Karobaar AI, a business advisor for small Indian e-commerce sellers.
    Give short, direct, actionable advice in 2-3 bullet points based on the following data:
    Business: ${businessData.name}
    Recent Revenue: ₹${businessData.revenue}
    Profit Margin: ${businessData.margin}%
    Return Rate: ${businessData.returnRate}%
    Actionable insights:
  `;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: prompt }],
      temperature: 0.5,
      max_tokens: 250,
    });
    
    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI Error:', error);
    throw new Error('Could not generate insights at this time');
  }
};

exports.calculateHealthScore = (metrics) => {
  let profitScore = Math.min(25, (metrics.margin / 20) * 25); // Target 20% margin
  let marketingScore = 20; // Stub, assuming ROAS > 3
  let pricingScore = 20;
  let inventoryScore = Math.max(0, 25 - (metrics.stockoutRisk * 5));

  const total = Math.round(profitScore + marketingScore + pricingScore + inventoryScore);
  
  return {
    total,
    profit: Math.round(profitScore),
    marketing: Math.round(marketingScore),
    pricing: Math.round(pricingScore),
    inventory: Math.round(inventoryScore)
  };
};
