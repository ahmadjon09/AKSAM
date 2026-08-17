import { Bot } from "grammy";
import { logger } from "./logger";
import { env } from "./env";

let bot: Bot | null = null;

function getBot(): Bot | null {
  if (!env.telegramBotToken) return null;

  if (!bot) {
    bot = new Bot(env.telegramBotToken);
  }

  return bot;
}

export interface LeadPayload {
  source: "ORDER" | "CONTACT";
  fullName: string;
  phone: string;
  message?: string;
  productName?: string;
  lang?: string;
}

function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, "\\$&");
}

function buildLeadMessage(lead: LeadPayload): string {
  const isOrder = lead.source === "ORDER";

  const title = isOrder
    ? "🛍️ *YANGI BUYURTMA*"
    : "📩 *YANGI MUROJAAT*";

  const lines: string[] = [
    title,
    "",
    "👤 *Mijoz*",
    escapeMarkdown(lead.fullName),
    "",
    "📞 *Telefon*",
    escapeMarkdown(lead.phone),
  ];

  if (lead.productName) {
    lines.push(
      "",
      "📦 *Mahsulot*",
      escapeMarkdown(lead.productName)
    );
  }

  if (lead.message) {
    lines.push(
      "",
      "💬 *Xabar*",
      escapeMarkdown(lead.message)
    );
  }

  if (lead.lang) {
    lines.push(
      "",
      `🌐 *Til:* ${escapeMarkdown(lead.lang.toUpperCase())}`
    );
  }

  lines.push(
    "",
    "━━━━━━━━━━━━━━━━━━",
    isOrder
      ? "🟢 *Yangi buyurtma qabul qilindi*"
      : "🟡 *Yangi murojaat qabul qilindi*"
  );

  return lines.join("\n");
}

export async function sendLeadToChannel(
  lead: LeadPayload
): Promise<boolean> {
  const client = getBot();

  if (!client || !env.telegramChannelId) {
    return false;
  }

  try {
    const message = buildLeadMessage(lead);

    await client.api.sendMessage(
      env.telegramChannelId,
      message,
      {
        parse_mode: "MarkdownV2",
      }
    );

    return true;
  } catch (err) {
    logger.warn(
      {
        err: (err as Error).message,
      },
      "telegram channel send failed"
    );

    return false;
  }
}

export async function sendAdminAlert(
  text: string
): Promise<void> {
  const client = getBot();

  if (!client || !env.telegramAdminChatId) {
    return;
  }

  try {
    await client.api.sendMessage(
      env.telegramAdminChatId,
      escapeMarkdown(text),
      {
        parse_mode: "MarkdownV2",
      }
    );
  } catch (err) {
    logger.warn(
      {
        err: (err as Error).message,
      },
      "telegram admin alert failed"
    );
  }
}