// Standalone Telegram bot (optional). Runs separately from the API and is
// used for admin utility commands:
//   /id      — replies with this chat's id (use it for TELEGRAM_ADMIN_CHAT_ID)
//   /status  — pings the API health endpoint
// The order-notification path lives inside the API itself; this process is
// only the low-priority admin tooling.

import { Bot } from "grammy";
import { env } from "../lib/env";
import { logger } from "../lib/logger";

if (!env.telegramBotToken) {
  logger.warn("TELEGRAM_BOT_TOKEN is not set — bot process exiting");
  process.exit(0);
}

const bot = new Bot(env.telegramBotToken);


bot.command("start", async (ctx) => {
  await ctx.reply(`
    Server is live 👍
    ${ctx.chat.id}`);
});

bot.command("id", async (ctx) => {
  await ctx.reply(`Chat ID: ${ctx.chat.id}`);
});

bot.command("status", async (ctx) => {
  const base = process.env.API_PUBLIC_URL ?? "https://api.aksam.uz";
  try {
    const res = await fetch(`${base}/health`, { signal: AbortSignal.timeout(5000) });
    const body = (await res.json()) as { status: string; db: string; cache: string };
    await ctx.reply(`API: ${body.status}\nDB: ${body.db}\nCache: ${body.cache}`);
  } catch {
    await ctx.reply("API is unreachable");
  }
});

bot.catch((err) => {
  logger.warn({ err: err.message }, "bot error");
});

void bot.start({
  onStart: () => logger.info("AKSAM admin bot started")
});
