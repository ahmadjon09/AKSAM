// Redis connection and cache helpers. Every read-heavy endpoint checks the
// cache first and only touches Postgres on a miss. Keys are namespaced and
// invalidated by the admin routes immediately after every write.

import Redis from "ioredis";
import { logger } from "./logger";

export const redis = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379", {
  maxRetriesPerRequest: 2,
  lazyConnect: false
});

redis.on("error", (err) => {
  logger.warn({ err: err.message }, "redis error");
});

const TTL = 300; // seconds

export async function getCached<T>(key: string): Promise<T | null> {
  try {
    const raw = await redis.get(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch (err) {
    logger.warn({ key, err: (err as Error).message }, "cache read failed, falling through to db");
    return null;
  }
}

export async function setCached(key: string, value: unknown, ttl = TTL): Promise<void> {
  try {
    await redis.set(key, JSON.stringify(value), "EX", ttl);
  } catch (err) {
    logger.warn({ key, err: (err as Error).message }, "cache write failed");
  }
}

export async function invalidate(...keys: string[]): Promise<void> {
  try {
    await redis.del(...keys);
  } catch (err) {
    logger.warn({ keys, err: (err as Error).message }, "cache invalidation failed");
  }
}

export const cacheKeys = {
  products: "cache:products:public",
  categories: "cache:categories:public",
  settings: "cache:settings:public",
  stats: "cache:stats:public"
};

// Fixed-window rate limiting backed by Redis. Window size and limit are set
// per route; buckets are keyed by IP or bearer token.
export async function hitRateLimit(bucket: string, id: string, limit: number, windowSeconds: number): Promise<boolean> {
  const key = `rl:${bucket}:${id}`;
  try {
    const count = await redis.incr(key);
    if (count === 1) {
      await redis.expire(key, windowSeconds);
    }
    return count > limit;
  } catch (err) {
    logger.warn({ err: (err as Error).message }, "rate limit store unavailable, allowing request");
    return false;
  }
}
