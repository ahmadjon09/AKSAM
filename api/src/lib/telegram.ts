// Telegram notifications. Leads are posted to the brand's channel the moment
// the API stores them; admin alerts go to the private admin chat. If the
// bot is not configured the site keeps working — the lead just stays in the
// database, visible in the admin panel.

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

export async function sendLeadToChannel(lead: LeadPayload): Promise<boolean> {
  const client = getBot();
  if (!client || !env.telegramChannelId) return false;

  const sourceLabel = lead.source === "ORDER" ? "Buyurtma" : "Aloqa";
  const lines = [
    `*Yangi ${sourceLabel.toLowerCase()}*`,
    ``,
    `Ism: ${lead.fullName}`,
    `Telefon: ${lead.phone}`
  ];
  if (lead.productName) lines.push(`Mahsulot: ${lead.productName}`);
  if (lead.message) lines.push(`Xabar: ${lead.message}`);
  if (lead.lang) lines.push(`Til: ${lead.lang}`);

  try {
    await client.api.sendMessage(env.telegramChannelId, lines.join("\n"));
    return true;
  } catch (err) {
    logger.warn({ err: (err as Error).message }, "telegram channel send failed");
    return false;
  }
}

export async function sendAdminAlert(text: string): Promise<void> {
  const client = getBot();
  if (!client || !env.telegramAdminChatId) return;
  try {
    await client.api.sendMessage(env.telegramAdminChatId, text);
  } catch (err) {
    logger.warn({ err: (err as Error).message }, "telegram admin alert failed");
  }
}
