// Input sanitation helpers. Every user-provided string is trimmed, stripped
// of control characters and capped in length before it reaches the database
// or the Telegram message.

const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export function cleanText(value: unknown, max = 3000): string {
  if (typeof value !== "string") return "";
  return value.replace(CONTROL, "").trim().slice(0, max);
}

export function cleanName(value: unknown): string {
  return cleanText(value, 120);
}

export function cleanPhone(value: unknown): string {
  const raw = cleanText(value, 30);
  // Accept +998 XX XXX XX XX and local 9-digit forms.
  let digits = raw.replace(/[^\d+]/g, "");
  if (!digits.startsWith("+") && !digits.startsWith("998")) {
    digits = "998" + digits.replace(/^0+/, "");
  }
  return digits.startsWith("+") ? digits : `+${digits}`;
}

export function cleanSlug(value: unknown): string {
  return cleanText(value, 80)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function sanitizeTelegram(text: string): string {
  // Escape markdown-parseable characters; the bot sends plain text anyway.
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, (ch) => `\\${ch}`);
}
