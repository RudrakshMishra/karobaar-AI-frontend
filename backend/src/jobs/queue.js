const { Queue } = require('bullmq');

const connection = {
  host: process.env.REDIS_URL ? new URL(process.env.REDIS_URL).hostname : 'localhost',
  port: process.env.REDIS_URL ? new URL(process.env.REDIS_URL).port : 6379,
};

const analyticsQueue = new Queue('analytics', { connection });
const scraperQueue = new Queue('scraper', { connection });
const digestQueue = new Queue('digest', { connection });

module.exports = {
  analyticsQueue,
  scraperQueue,
  digestQueue
};
