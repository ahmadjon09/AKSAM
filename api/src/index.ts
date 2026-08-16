// AKSAM API bootstrap. Fastify + helmet + CORS + multipart + auth plugin +
// rate limiting + routes, then a health check and graceful shutdown.

import Fastify from "fastify";
import helmet from "@fastify/helmet";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import multipart from "@fastify/multipart";

import { env } from "./lib/env";
import { logger } from "./lib/logger";
import { prisma } from "./lib/prisma";
import { redis } from "./lib/redis";
import { flushPendingDays, startAnalyticsFlusher } from "./lib/analytics";
import { AppError } from "./lib/errors";

import rateLimitPlugin from "./plugins/rateLimit";
import authPlugin from "./plugins/auth";
import publicRoutes from "./routes/public";
import adminAuthRoutes from "./routes/adminAuth";
import adminProductRoutes from "./routes/adminProducts";
import adminCategoryRoutes from "./routes/adminCategories";
import adminLeadRoutes from "./routes/adminLeads";
import adminSettingsRoutes from "./routes/adminSettings";
import adminStatsRoutes from "./routes/adminStats";
import adminUploadRoutes from "./routes/adminUpload";
const app = Fastify({
  loggerInstance: logger,
  bodyLimit: 1_000_000,
  trustProxy: true
});

// -------------------------------------------------------- error handling
app.setErrorHandler((error, request, reply) => {
  // Structural check instead of instanceof: zod ships dual ESM/CJS builds and
  // class identity can differ across module instances.
  const zodLike = error as { name?: string; issues?: { path: PropertyKey[]; message: string }[] };
  if (zodLike.name === "ZodError" && Array.isArray(zodLike.issues)) {
    return reply.status(400).send({
      code: "validation_error",
      message: "Validation failed",
      issues: zodLike.issues.map((i) => ({ path: String(i.path.join(".")), message: i.message }))
    });
  }
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({ code: error.code, message: error.message });
  }
  if ((error as { statusCode?: number }).statusCode === 429) {
    return reply.status(429).send({ code: "rate_limited", message: "Too many requests" });
  }
  request.log.error({ err: error }, "unhandled error");
  return reply.status(500).send({ code: "internal", message: "Internal server error" });
});

app.setNotFoundHandler((request, reply) => {
  return reply.status(404).send({ code: "not_found", message: `No route ${request.method} ${request.url}` });
});


async function main() {
  // ------------------------------------------------------------------ plugins
  await app.register(helmet, {
    contentSecurityPolicy: false, // API responses are JSON, not documents
    crossOriginResourcePolicy: { policy: "cross-origin" }
  });

  await app.register(cors, {
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);

      const allowed = env.corsOrigins;

      const isExact = allowed.includes(origin);

      const isPreview =
        env.allowPreviewOrigins &&
        /^https?:\/\/([a-z0-9-]+\.)*(e2b\.app|pages\.dev|trycloudflare\.com|localhost)(:\d+)?$/i.test(origin);

      if (isExact || isPreview) {
        return cb(null, true);
      }

      logger.warn({ origin }, "cors origin rejected");
      return cb(new Error("Not allowed by CORS"), false);
    },

    credentials: true,

    methods: [
      "GET",
      "HEAD",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS"
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization"
    ]
  });
  await app.register(cookie);
  await app.register(multipart, { limits: { fileSize: 8 * 1024 * 1024, files: 1 } });
  await app.register(rateLimitPlugin);
  await app.register(authPlugin);

  // Global rate limit for everything public.
  app.addHook("onRequest", app.rateLimit({ bucket: "global", limit: 300, windowSeconds: 60 }));

  // ------------------------------------------------------------------ routes
  await app.register(publicRoutes);
  await app.register(adminAuthRoutes);
  await app.register(adminProductRoutes);
  await app.register(adminCategoryRoutes);
  await app.register(adminLeadRoutes);
  await app.register(adminSettingsRoutes);
  await app.register(adminStatsRoutes);
  await app.register(adminUploadRoutes);

  // ------------------------------------------------------------------ health
  app.get("/health", async () => {
    let db = "up";
    let cache = "up";
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      db = "down";
    }
    try {
      await redis.ping();
    } catch {
      cache = "down";
    }
    return {
      status: db === "up" ? "ok" : "degraded",
      db,
      cache,
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString()
    };
  });

  const keepServerAlive = () => {
    if (!process.env.API_PUBLIC_URL) return;

    setInterval(async () => {
      try {
        await fetch(`${process.env.API_PUBLIC_URL}/health`);
        console.log('🔄 Alive');
      } catch (e) {
        console.log('Ping failed');
      }
    }, 10 * 60 * 1000);
  };

  keepServerAlive()

  // ------------------------------------------------------------- lifecycle
  const flusher = startAnalyticsFlusher();

  let closing = false;
  async function shutdown(signal: string) {
    if (closing) return;
    closing = true;
    logger.info({ signal }, "graceful shutdown started");
    clearInterval(flusher);
    try {
      await flushPendingDays();
    } catch {
      // Flush is best-effort during shutdown.
    }
    try {
      await app.close();
    } catch (err) {
      logger.error({ err: (err as Error).message }, "error closing server");
    }
    await prisma.$disconnect();
    redis.disconnect();
    process.exit(0);
  }

  process.on("SIGTERM", () => void shutdown("SIGTERM"));
  process.on("SIGINT", () => void shutdown("SIGINT"));

  try {
    await app.listen({ port: env.port, host: env.host });
    logger.info(`AKSAM API listening on http://${env.host}:${env.port}`);
  } catch (err) {
    logger.error({ err }, "failed to start");
    process.exit(1);
  }
}

void main();
