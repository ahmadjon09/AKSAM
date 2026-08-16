// Small shared helpers. No magic — just the pieces every page needs.

import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Uzbek phone numbers: +998 XX XXX XX XX. We accept with or without the country code. */
export function normalizePhone(value: string): string {
  let digits = value.replace(/[^\d+]/g, "");
  if (!digits.startsWith("+") && !digits.startsWith("998")) {
    digits = "998" + digits.replace(/^0+/, "");
  }
  return digits.replace(/^\+?/, "+").trim();
}

export function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  // 998 + 9 digits, or a local 9-digit number starting with 9
  return /^998\d{9}$/.test(digits) || /^9\d{8}$/.test(digits);
}

export function formatDate(iso: string, lang: string): string {
  try {
    return new Date(iso).toLocaleDateString(lang === "ru" ? "ru-RU" : lang === "uz" ? "uz-UZ" : "en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  } catch {
    return iso;
  }
}

export function formatDayLabel(day: string, lang: string): string {
  // "2026-08-14" -> short human label like "14 Aug"
  try {
    const [y, m, d] = day.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(
      lang === "ru" ? "ru-RU" : lang === "uz" ? "uz-UZ" : "en-GB",
      { day: "2-digit", month: "short" }
    );
  } catch {
    return day;
  }
}

/** A tiny solid-colour SVG placeholder used as blurDataURL for product images. */
export function blurPlaceholder(seed: string, tone = "#e8e4dc"): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="18"><rect width="24" height="18" fill="${tone}"/></svg>`;
  // btoa is available in browsers and Node; Buffer is not (client bundle).
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}

export function initialsOf(fullName: string): string {
  return fullName
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

/** Build a slug the same way the admin does: latin lowercase + dashes. */
export function slugify(value: string): string {
  const map: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "j", з: "z",
    и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
    с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh",
    щ: "sch", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
    ў: "u", қ: "q", ғ: "g", ҳ: "h", ʻ: "", "oʻ": "o", "gʻ": "g"
  };
  const latin = value
    .toLowerCase()
    .split("")
    .map((ch) => map[ch] ?? ch)
    .join("");
  return latin
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function isValidSlug(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}
