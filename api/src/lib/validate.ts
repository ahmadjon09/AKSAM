// Zod schemas for every write endpoint. Validation runs before any business
// logic; sanitized strings come from sanitize.ts.

import { z } from "zod";
import { cleanName, cleanPhone, cleanSlug, cleanText } from "./sanitize";

const phoneSchema = z
  .string()
  .min(5, "phone_too_short")
  .max(30)
  .refine((v) => /^\+998\d{9}$/.test(cleanPhone(v)), "invalid_phone");

export const orderSchema = z.object({
  fullName: z.string().min(2, "name_required").max(120),
  phone: phoneSchema,
  message: z.string().max(2000).optional().or(z.literal("")),
  productSlug: z.string().max(80).optional().or(z.literal("")),
  productName: z.string().max(200).optional().or(z.literal("")),
  lang: z.enum(["uz", "ru", "en"]).optional(),
  website: z.string().max(100).optional(),
  honey: z.string().max(10).optional()
});

export const contactSchema = z.object({
  fullName: z.string().min(2, "name_required").max(120),
  phone: phoneSchema,
  message: z.string().max(2000).optional().or(z.literal("")),
  lang: z.enum(["uz", "ru", "en"]).optional(),
  honey: z.string().max(10).optional()
});

export const trackSchema = z.object({
  token: z.string().regex(/^[a-f0-9]{32}$/i, "invalid_token"),
  path: z.string().max(300),
  referrer: z.string().max(400).optional(),
  lang: z.enum(["uz", "ru", "en"]).optional()
});

export const loginSchema = z.object({
  email: z.string().email().max(160),
  password: z.string().min(6).max(120)
});

const localizedString = z.string().max(5000);

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const productInputSchema = z.object({
    slug: z.string().min(2).max(80),
    categoryId: z.string().min(1),
    name: z.object({ uz: localizedString, ru: localizedString, en: localizedString }),
    short: z.object({ uz: localizedString, ru: localizedString, en: localizedString }).optional(),
    description: z.object({ uz: localizedString, ru: localizedString, en: localizedString }).optional(),
    metaTitle: z.object({ uz: localizedString, ru: localizedString, en: localizedString }).optional(),
    metaDesc: z.object({ uz: localizedString, ru: localizedString, en: localizedString }).optional(),
    highlights: z.object({ uz: z.array(z.string().max(300)), ru: z.array(z.string().max(300)), en: z.array(z.string().max(300)) }).optional(),
    specs: z
      .object({
        uz: z.array(z.object({ label: z.string().max(80), value: z.string().max(160) })).max(20),
        ru: z.array(z.object({ label: z.string().max(80), value: z.string().max(160) })).max(20),
        en: z.array(z.object({ label: z.string().max(80), value: z.string().max(160) })).max(20)
      })
      .optional(),
    images: z.array(z.string().max(600)).min(1, "image_required"),
    isActive: z.boolean().optional(),
    sortOrder: z.number().int().min(0).max(10000).optional()
  });

export const categoryInputSchema = z.object({
  slug: z.string().min(2).max(80),
  name: z.object({ uz: localizedString, ru: localizedString, en: localizedString }),
  description: z.object({ uz: localizedString, ru: localizedString, en: localizedString }).optional(),
  image: z.string().max(600).optional().or(z.literal("")),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().min(0).max(10000).optional()
});

export const settingsInputSchema = z.object({
  siteName: z.string().min(1).max(100).optional(),
  tagline: z.string().max(500).optional(),
  phone: z.string().max(40).optional(),
  phone2: z.string().max(40).optional(),
  email: z.string().email().max(160).optional(),
  address: z.string().max(500).optional(),
  workHours: z.string().max(200).optional(),
  mapLat: z.number().min(-90).max(90).optional(),
  mapLng: z.number().min(-180).max(180).optional(),
  mapLabel: z.string().max(300).optional(),
  instagram: z.string().max(300).optional(),
  telegram: z.string().max(300).optional(),
  facebook: z.string().max(300).optional()
});

export const leadUpdateSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "CLOSED", "SPAM"]).optional(),
  note: z.string().max(2000).optional()
});

export function sanitizedOrder(body: unknown) {
  const parsed = orderSchema.parse(body);
  return {
    fullName: cleanName(parsed.fullName),
    phone: cleanPhone(parsed.phone),
    message: parsed.message ? cleanText(parsed.message, 2000) : null,
    productSlug: parsed.productSlug ? cleanSlug(parsed.productSlug) || null : null,
    productName: parsed.productName ? cleanText(parsed.productName, 200) : null,
    lang: parsed.lang ?? null
  };
}

export function sanitizedContact(body: unknown) {
  const parsed = contactSchema.parse(body);
  return {
    fullName: cleanName(parsed.fullName),
    phone: cleanPhone(parsed.phone),
    message: parsed.message ? cleanText(parsed.message, 2000) : null,
    lang: parsed.lang ?? null
  };
}
