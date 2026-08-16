// Structured logging via pino. Pretty printing only in development, so
// production logs stay machine-readable for PM2/Docker collectors.

import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  transport:
    process.env.NODE_ENV === "development"
      ? { target: "pino-pretty", options: { colorize: true, translateTime: "HH:MM:ss", ignore: "pid,hostname" } }
      : undefined,
  redact: ["req.headers.authorization", "req.headers.cookie", "passwordHash"]
});
