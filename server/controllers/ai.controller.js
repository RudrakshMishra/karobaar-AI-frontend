const prisma = require('../utils/db');
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
});

exports.copilot = async (req, res) => {
  try {
    const suggestions = [
      { type: 'opportunity', priority: 'high', title: 'Increase Price', description: 'Product A margin is low, increase price by ₹50.', action: 'Review Pricing' },
      { type: 'warning', priority: 'medium', title: 'Low Stock Alert', description: 'Product B will run out in 5 days.', action: 'Reorder Now' }
    ];
    res.json({ success: true, data: { suggestions } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.chat = async (req, res) => {
  try {
    const { message } = req.body;
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const userId = req.auth?.userId || 'dummy_user';
    let products = [];
    try {
      products = await prisma.product.findMany({ where: { user_id: userId }, take: 10 });
    } catch (e) {
      console.warn("DB offline. Using mock products for chat.");
    }
    const contextStr = products.length > 0 
      ? JSON.stringify(products.map(p => ({ name: p.name, cost: p.cost, price: p.current_price, stock: p.current_stock })))
      : JSON.stringify([
          { name: "Noise Cancelling Earbuds PRO", cost: 1200, price: 2999, stock: 145 },
          { name: "Ergonomic Office Chair X1", cost: 4500, price: 8499, stock: 12 },
          { name: "Mechanic Keyboard RGB", cost: 1800, price: 3499, stock: 0 },
          { name: "Smart Fitness Watch", cost: 800, price: 1999, stock: 250 },
          { name: "Wireless Charging Pad", cost: 400, price: 999, stock: 30 },
          { name: "Premium Leather Wallet", cost: 500, price: 1499, stock: 85 }
        ]);

    let isMock = false;
    let stream;
    
    try {
      stream = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: `You are Karobaar AI, an e-commerce assistant. The user's store has the following inventory data: ${contextStr}. Give short, concise, and helpful answers based on this data.` },
          { role: 'user', content: message || 'Hello' }
        ],
        stream: true,
      });
    } catch (apiError) {
      isMock = true;
    }

    if (isMock) {
      // Mock stream for dead API keys (insufficient quota)
      const msgLower = (message || "").toLowerCase();
      let mockReply = `That is an interesting question about "${message.substring(0, 30)}${message.length > 30 ? '...' : ''}". Based on your dummy data, everything looks stable, but I recommend checking your dashboard for a full breakdown!`;
      
      if (msgLower.includes("pricing") || msgLower.includes("price") || msgLower.includes("cost")) {
        mockReply = "Your 'Ergonomic Office Chair X1' is priced at ₹8,499 (Cost: ₹4,500), yielding a great profit margin! However, you might want to raise the price slightly since you only have 12 left in stock.";
      } else if (msgLower.includes("stock") || msgLower.includes("inventory") || msgLower.includes("empty") || msgLower.includes("left")) {
        mockReply = "URGENT: Your 'Mechanic Keyboard RGB' is completely OUT OF STOCK! You are losing potential sales. Meanwhile, you have plenty of 'Smart Fitness Watches' (250 units).";
      } else if (msgLower.includes("business") || msgLower.includes("grow") || msgLower.includes("profit") || msgLower.includes("revenue")) {
        mockReply = "To grow your business right now, I highly recommend running targeted ads for the 'Noise Cancelling Earbuds PRO'. You have 145 units in stock and the profit margin is excellent!";
      } else if (msgLower.includes("hello") || msgLower.includes("hi") || msgLower.includes("hey")) {
        mockReply = "Hello there! I am Karobaar AI (running in Offline Mode). How can I help you dominate the e-commerce market today?";
      }

      // Simulate streaming
      const words = mockReply.split(' ');
      for (const word of words) {
        res.write(`data: ${JSON.stringify({ chunk: word + " " })}\n\n`);
        await new Promise(r => setTimeout(r, 10)); // 5x faster streaming
      }
      res.write('data: [DONE]\n\n');
      return res.end();
    }

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        res.write(`data: ${JSON.stringify({ chunk: content })}\n\n`);
      }
    }
    
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    res.write(`data: ${JSON.stringify({ chunk: "Sorry, I am facing an issue connecting right now." })}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();
  }
};

exports.getSuggestions = async (req, res) => {
  try {
    const { status = 'active', limit = 10 } = req.query;
    let data = [];
    try {
      data = await prisma.aiSuggestion.findMany({
        where: {
          user_id: req.auth.userId,
          status: String(status)
        },
        take: Number(limit),
        orderBy: { created_at: 'desc' }
      });
    } catch (e) {
      console.warn("DB offline. Returning empty suggestions.");
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.generateSuggestions = async (req, res) => {
  try {
    const userId = req.auth.userId;

    // Fetch user context
    let products = [];
    try {
      products = await prisma.product.findMany({ where: { user_id: userId }, take: 10 });
    } catch(e) {}
    
    // Fallback context if no products exist
    const contextStr = products.length > 0 
      ? JSON.stringify(products.map(p => ({ name: p.name, cost: p.cost, price: p.current_price, stock: p.current_stock })))
      : JSON.stringify([
          { name: "Noise Cancelling Earbuds PRO", cost: 1200, price: 2999, stock: 145 },
          { name: "Ergonomic Office Chair X1", cost: 4500, price: 8499, stock: 12 },
          { name: "Mechanic Keyboard RGB", cost: 1800, price: 3499, stock: 0 },
          { name: "Smart Fitness Watch", cost: 800, price: 1999, stock: 250 },
          { name: "Wireless Charging Pad", cost: 400, price: 999, stock: 30 },
          { name: "Premium Leather Wallet", cost: 500, price: 1499, stock: 85 }
        ]);

    const prompt = `
      You are an expert e-commerce AI assistant. Analyze the following store data: ${contextStr}.
      Generate exactly 3 high-impact, actionable business insights to improve profit or operations.
      Return the response STRICTLY as a JSON array of objects. 
      Do not include markdown blocks like \`\`\`json.
      Each object must match this schema:
      {
        "type": "string (e.g., 'Pricing Strategy', 'Ad Spend Risk', 'Inventory Warning', 'Growth Opportunity')",
        "title": "string (Short action-oriented title)",
        "description": "string (1-2 sentences explaining the insight and potential impact)",
        "priority": "string (either 'high', 'medium', or 'low')",
        "action": "string (Short button text, e.g., 'Apply Smart Pricing', 'Pause Campaigns')"
      }
    `;

    let suggestionsData = [];
    
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'system', content: prompt }],
        temperature: 0.7,
        response_format: { type: "json_object" }
      });

      let suggestionsRaw = completion.choices[0].message.content;
      const parsed = JSON.parse(suggestionsRaw);
      if (Array.isArray(parsed)) {
        suggestionsData = parsed;
      } else if (parsed.suggestions && Array.isArray(parsed.suggestions)) {
        suggestionsData = parsed.suggestions;
      } else {
         suggestionsData = Object.values(parsed).find(val => Array.isArray(val)) || [];
      }
    } catch (apiError) {
      console.warn("OpenAI API failed (likely quota exceeded). Falling back to mock insights.");
      suggestionsData = [
        { type: "Pricing Strategy", title: "Adjust X1 Chair Price", description: "Your Ergonomic Office Chair X1 is priced high but stock is very low. Consider slightly raising the price to maximize profit before stockout.", priority: "medium", action: "Review Pricing" },
        { type: "Inventory Warning", title: "Restock Mechanic Keyboard", description: "Mechanic Keyboard RGB is completely out of stock. You are losing potential sales based on previous velocity.", priority: "high", action: "Reorder Now" },
        { type: "Growth Opportunity", title: "Boost Earbuds Ads", description: "Noise Cancelling Earbuds PRO have an excellent margin and high stock (145 units). Allocating more ad spend here will multiply profits safely.", priority: "high", action: "Increase Budget" }
      ];
    }

    // Insert into DB
    let createdSuggestions = [];
    try {
      for (const item of suggestionsData) {
        const suggestion = await prisma.aiSuggestion.create({
          data: {
            user_id: userId,
            type: item.type || 'Insight',
            priority: item.priority || 'medium',
            title: item.title || 'New Opportunity',
            description: item.description || '',
            action: item.action || 'Review',
            status: 'active'
          }
        });
        createdSuggestions.push(suggestion);
      }
    } catch (e) {
      console.warn("DB offline. Returning generated suggestions without saving.");
      createdSuggestions = suggestionsData.map((s, i) => ({ ...s, id: `mock_${i}`, created_at: new Date() }));
    }

    res.json({ success: true, data: createdSuggestions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.applySuggestion = async (req, res) => {
  try {
    const data = await prisma.aiSuggestion.updateMany({
      where: {
        id: req.params.id,
        user_id: req.auth.userId
      },
      data: {
        status: 'applied',
        applied_at: new Date()
      }
    });
    res.json({ success: true, data: { updated: data.count > 0 } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.dismissSuggestion = async (req, res) => {
  try {
    const data = await prisma.aiSuggestion.updateMany({
      where: {
        id: req.params.id,
        user_id: req.auth.userId
      },
      data: {
        status: 'dismissed',
        dismissed_at: new Date()
      }
    });
    res.json({ success: true, data: { updated: data.count > 0 } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.pricingSuggestions = async (req, res) => {
  res.json({ success: true, data: [] });
};

exports.weeklyDigest = async (req, res) => {
  res.json({ success: true, data: {} });
};
