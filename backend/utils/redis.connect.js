// redis.connect.js
import { createClient } from 'redis';
// import dotenv from 'dotenv'

// dotenv.config()

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on('error', (err) => console.error('❌ Redis Client Error:', err));
redisClient.on('connect', () => console.log('🔌 Redis client connecting...'));
redisClient.on('ready', () => console.log('✅ Redis client connected and ready!'));

export default redisClient;
