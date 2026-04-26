const { Worker } = require('bullmq');
const puppeteer = require('puppeteer');
const { prisma } = require('../../config/db');

const connection = {
  host: process.env.REDIS_URL ? new URL(process.env.REDIS_URL).hostname : 'localhost',
  port: process.env.REDIS_URL ? new URL(process.env.REDIS_URL).port : 6379,
};

const scrapeProductMetrics = async (url, platform) => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
  
  let result = { price: 0, rating: 0 };
  
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    if (platform.toLowerCase() === 'amazon') {
      const priceElement = await page.$('.a-price-whole');
      if (priceElement) {
        const text = await page.evaluate(el => el.textContent, priceElement);
        result.price = parseFloat(text.replace(/[^0-9.-]+/g, ""));
      }
      
      const ratingElement = await page.$('.a-icon-star span');
      if (ratingElement) {
        const text = await page.evaluate(el => el.textContent, ratingElement);
        result.rating = parseFloat(text.split(' ')[0]);
      }
    } else if (platform.toLowerCase() === 'flipkart') {
      const priceElement = await page.$('._30jeq3');
      if (priceElement) {
        const text = await page.evaluate(el => el.textContent, priceElement);
        result.price = parseFloat(text.replace(/[^0-9.-]+/g, ""));
      }
    }
  } catch (error) {
    console.error(`Scrape failed for ${url}:`, error.message);
  } finally {
    await browser.close();
  }
  
  return result;
};

const scraperWorker = new Worker('scraper', async job => {
  const { competitorId } = job.data;
  
  const competitor = await prisma.competitor.findUnique({ where: { id: competitorId } });
  if (!competitor) return;

  const { price, rating } = await scrapeProductMetrics(competitor.url, competitor.platform);

  await prisma.competitor.update({
    where: { id: competitorId },
    data: {
      lastPrice: price || competitor.lastPrice,
      lastRating: rating || competitor.lastRating,
      lastScrapedAt: new Date()
    }
  });

}, { connection, concurrency: 5 });

scraperWorker.on('completed', job => {
  console.log(`Scraper Job ${job.id} has completed!`);
});

scraperWorker.on('failed', (job, err) => {
  console.error(`Scraper Job ${job.id} has failed with ${err.message}`);
});

module.exports = scraperWorker;
