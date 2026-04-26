const { Redis } = require('@upstash/redis');

let redis;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
} else {
  // Mock Redis for local dev if keys are missing
  console.warn('[Redis] Missing keys, using mock memory cache');
  const cache = new Map();
  redis = {
    get: async (key) => cache.get(key) || null,
    setex: async (key, seconds, value) => {
      cache.set(key, value);
      setTimeout(() => cache.delete(key), seconds * 1000);
      return 'OK';
    },
    del: async (key) => cache.delete(key),
  };
}

module.exports = redis;
