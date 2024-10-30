import { Redis } from 'ioredis'; // Use named import so that we can construct a Redis object
import dotenv from 'dotenv';

dotenv.config();

const isDev = process.env.IS_DEV === 'true'; // Ensure this is a boolean

// Configuration for different environments
const redisLocalOptions = {
  host: '127.0.0.1',
  port: 6379, // Default Redis port
};

const redisProdOptions = {
  host: process.env.AWS_CONFIG_ENDPOINT,
  port: 6379, // Default Redis port
};

// Create a Redis client based on the environment
export const redisClient = new Redis(isDev ? redisLocalOptions : redisProdOptions);
