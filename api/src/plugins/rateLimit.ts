// Global + per-route rate limiting backed by Redis (fixed window). Buckets
// are per IP by default; admin write routes use the bearer token so one
// client can't hide behind rotating IPs. Rate limit failures return 429
// with a Retry-After header.

import fp from "fastify-plugin";
import type { FastifyReply, FastifyRequest } from "fastify";
import { hitRateLimit } from "../lib/redis";
import { rateLimited } from "../lib/errors";

export interface RateLimitOptions {
  limit: number;
  windowSeconds: number;
  bucket: string;
  byToken?: boolean;
}

export function clientId(request: FastifyRequest, byToken: boolean): string {
  if (byToken) {
    const header = request.headers.authorization ?? "";
    return header.replace(/^Bearer\s+/i, "").slice(-32) || "anonymous";
  }
  const forwarded = request.headers["x-forwarded-for"];
  const ip = typeof forwarded === "string" ? forwarded.split(",")[0].trim() : request.ip;
  return ip || "unknown";
}

export default fp(async (fastify) => {
  fastify.decorate("rateLimit", (options: RateLimitOptions) => {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      const id = clientId(request, options.byToken ?? false);
      const blocked = await hitRateLimit(options.bucket, id, options.limit, options.windowSeconds);
      if (blocked) {
        reply.header("Retry-After", String(options.windowSeconds));
        throw rateLimited();
      }
    };
  });
});

declare module "fastify" {
  interface FastifyInstance {
    rateLimit: (options: RateLimitOptions) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}
