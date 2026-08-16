// Anonymous visit analytics. The frontend sends a beacon with the visitor's
// token; we hash it (never storing the raw token), count views per
// (day, tokenHash) in Redis and flush into Postgres on a short interval so
// the admin dashboard sees near-live numbers without a write per page view.

import * as crypto from "crypto";
import { prisma } from "./prisma";
import { redis } from "./redis";
import { logger } from "./logger";

const FLUSH_INTERVAL_MS = 45_000;
const PENDING_KEY = "stats:pending-days";

export function dayKey(date: Date): string {
  // Days follow the Tashkent timezone, matching the audience.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tashkent",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  })
    .format(date)
    .replace(/\//g, "-");
}

export function hashVisitorToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function recordVisit(token: string): Promise<void> {
  const day = dayKey(new Date());
  const hash = hashVisitorToken(token);
  try {
    await redis.hincrby(`stats:day:${day}`, hash, 1);
    await redis.sadd(PENDING_KEY, day);
  } catch (err) {
    logger.warn({ err: (err as Error).message }, "visit tracking failed");
  }
}

export async function flushPendingDays(): Promise<void> {
  try {
    const days = await redis.smembers(PENDING_KEY);
    if (days.length === 0) return;

    for (const day of days) {
      const key = `stats:day:${day}`;
      const entries = await redis.hgetall(key);
      const hashes = Object.keys(entries);
      if (hashes.length === 0) continue;

      for (const tokenHash of hashes) {
        const views = parseInt(entries[tokenHash], 10) || 0;
        await prisma.visitorDay.upsert({
          where: { day_tokenHash: { day, tokenHash } },
          update: { views: { increment: views }, updatedAt: new Date() },
          create: { day, tokenHash, views }
        });
      }
      await redis.del(key);
      await redis.srem(PENDING_KEY, day);
    }
  } catch (err) {
    logger.warn({ err: (err as Error).message }, "analytics flush failed");
  }
}

export function startAnalyticsFlusher(): NodeJS.Timeout {
  const timer = setInterval(() => {
    void flushPendingDays();
  }, FLUSH_INTERVAL_MS);
  timer.unref();
  return timer;
}
