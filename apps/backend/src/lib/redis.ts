import Redis from "ioredis";

const redisUrl = Bun.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("Redis_URL is not set");
}

export const redis = new Redis(redisUrl);
