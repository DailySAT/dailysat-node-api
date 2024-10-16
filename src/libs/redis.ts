import Redis from 'ioredis'; // Ensure you have ioredis installed
import dotenv from 'dotenv'

dotenv.config();

const isDev = process.env.IS_DEV || false

// Different configs set up for different environments: a development and a production

const redisLocalOptions = 
  [
      { host: '127.0.0.1', port: 7001 },
      { host: '127.0.0.1', port: 7002 },
      { host: '127.0.0.1', port: 7003 },
      { host: '127.0.0.1', port: 7004 },
      { host: '127.0.0.1', port: 7005 },
      { host: '127.0.0.1', port: 7006 },
      { host: '127.0.0.1', port: 7007 },
  ]
;

const redisProdOptions = 
  [
    {
      host: process.env.AWS_CONFIG_ENDPOINT,
      port: 6379, // Default Redis port, so therefore used by default within this app
    },
  ]
;

export const cluster = new Redis.Cluster(isDev ? redisLocalOptions : redisProdOptions);
