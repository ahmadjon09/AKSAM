// Environment access with a tiny bit of validation. Failing fast at startup
// with a clear message beats mysterious runtime errors.

import "dotenv/config";

function req(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: parseInt(process.env.PORT ?? "4000", 10),
  host: process.env.API_HOST ?? "0.0.0.0",
  corsOrigins: (process.env.CORS_ORIGINS ?? "").split(",").map((s) => s.trim()).filter(Boolean),
  allowPreviewOrigins: (process.env.ALLOW_PREVIEW_ORIGINS ?? "false") === "true",
  databaseUrl: req("DATABASE_URL"),
  redisUrl: req("REDIS_URL"),
  jwtAccessSecret: req("JWT_ACCESS_SECRET"),
  jwtRefreshSecret: req("JWT_REFRESH_SECRET"),
  accessTokenTtl: process.env.ACCESS_TOKEN_TTL ?? "15m",
  refreshTokenTtlDays: parseInt(process.env.REFRESH_TOKEN_TTL_DAYS ?? "7", 10),
  cookieSameSite: (process.env.COOKIE_SAMESITE ?? "lax") as "lax" | "strict" | "none",
  cookieSecure: (process.env.COOKIE_SECURE ?? "false") === "true",
  adminEmail: process.env.ADMIN_EMAIL ?? "admin@aksam.uz",
  adminPassword: process.env.ADMIN_PASSWORD ?? "Aksam2026!",
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN ?? "",
  telegramChannelId: process.env.TELEGRAM_CHANNEL_ID ?? "",
  telegramAdminChatId: process.env.TELEGRAM_ADMIN_CHAT_ID ?? "",
  imgbbApiKey: process.env.IMGBB_API_KEY ?? "",
  logLevel: process.env.LOG_LEVEL ?? "info"
};
