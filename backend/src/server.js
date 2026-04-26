const app = require('./app');
const { prisma } = require('./config/db');
const redisClient = require('./config/redis');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Test DB connections
    try {
      await prisma.$connect();
      console.log('✅ PostgreSQL connected via Prisma');
    } catch (e) {
      console.log('⚠️ PostgreSQL not connected. Running in Mock Mode.');
    }

    try {
      await redisClient.ping();
      console.log('✅ Redis connected');
    } catch (e) {
      console.log('⚠️ Redis not connected. Cache disabled.');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Server failed to start:', error);
    process.exit(1);
  }
}

startServer();

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err);
  process.exit(1);
});
