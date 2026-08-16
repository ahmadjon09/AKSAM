// Maps Prisma rows to the public DTO shapes the frontend expects.
// Localized fields are always full {uz, ru, en} objects; arrays are parsed
// from their JSON columns defensively so a bad row can never crash a page.

type Json = import("@prisma/client/runtime/library").JsonValue;

function asStringArray(value: Json | null): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string");
}

function asSpecsArray(value: Json | null): { label: string; value: string }[] {
  if (!Array.isArray(value)) return [];
  const out: { label: string; value: string }[] = [];
  for (const item of value) {
    if (item && typeof item === "object" && !Array.isArray(item)) {
      const rec = item as Record<string, unknown>;
      if (typeof rec.label === "string" && typeof rec.value === "string") {
        out.push({ label: rec.label, value: rec.value });
      }
    }
  }
  return out;
}

function localized(field: Record<"uz" | "ru" | "en", string> | undefined) {
  return { uz: field?.uz ?? "", ru: field?.ru ?? "", en: field?.en ?? "" };
}

type CategoryRow = {
  id: string;
  slug: string;
  nameUz: string;
  nameRu: string;
  nameEn: string;
  descUz: string;
  descRu: string;
  descEn: string;
  image: string | null;
  isActive: boolean;
  sortOrder: number;
};

export function categoryDto(row: CategoryRow) {
  return {
    id: row.id,
    slug: row.slug,
    name: localized({ uz: row.nameUz, ru: row.nameRu, en: row.nameEn }),
    description: localized({ uz: row.descUz, ru: row.descRu, en: row.descEn }),
    image: row.image,
    isActive: row.isActive,
    sortOrder: row.sortOrder
  };
}

type ProductRow = {
  id: string;
  slug: string;
  nameUz: string;
  nameRu: string;
  nameEn: string;
  shortUz: string;
  shortRu: string;
  shortEn: string;
  descUz: string;
  descRu: string;
  descEn: string;
  metaTitleUz: string;
  metaTitleRu: string;
  metaTitleEn: string;
  metaDescUz: string;
  metaDescRu: string;
  metaDescEn: string;
  highlightsUz: Json;
  highlightsRu: Json;
  highlightsEn: Json;
  specsUz: Json;
  specsRu: Json;
  specsEn: Json;
  images: Json;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  category?: { slug: string; nameUz: string; nameRu: string; nameEn: string } | null;
};

export function productDto(row: ProductRow) {
  return {
    id: row.id,
    slug: row.slug,
    category: row.category
      ? {
          slug: row.category.slug,
          name: localized({ uz: row.category.nameUz, ru: row.category.nameRu, en: row.category.nameEn })
        }
      : null,
    name: localized({ uz: row.nameUz, ru: row.nameRu, en: row.nameEn }),
    short: localized({ uz: row.shortUz, ru: row.shortRu, en: row.shortEn }),
    description: localized({ uz: row.descUz, ru: row.descRu, en: row.descEn }),
    metaTitle: localized({ uz: row.metaTitleUz, ru: row.metaTitleRu, en: row.metaTitleEn }),
    metaDesc: localized({ uz: row.metaDescUz, ru: row.metaDescRu, en: row.metaDescEn }),
    highlights: {
      uz: asStringArray(row.highlightsUz),
      ru: asStringArray(row.highlightsRu),
      en: asStringArray(row.highlightsEn)
    },
    specs: {
      uz: asSpecsArray(row.specsUz),
      ru: asSpecsArray(row.specsRu),
      en: asSpecsArray(row.specsEn)
    },
    images: asStringArray(row.images),
    isActive: row.isActive,
    sortOrder: row.sortOrder,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString()
  };
}

type SettingsRow = {
  siteName: string;
  tagline: string;
  phone: string;
  phone2: string;
  email: string;
  address: string;
  workHours: string;
  mapLat: number;
  mapLng: number;
  mapLabel: string;
  instagram: string;
  telegram: string;
  facebook: string;
};

export function settingsDto(row: SettingsRow) {
  return {
    siteName: row.siteName,
    tagline: { uz: row.tagline, ru: row.tagline, en: row.tagline },
    phone: row.phone,
    phone2: row.phone2,
    email: row.email,
    address: { uz: row.address, ru: row.address, en: row.address },
    workHours: { uz: row.workHours, ru: row.workHours, en: row.workHours },
    mapLat: row.mapLat,
    mapLng: row.mapLng,
    mapLabel: { uz: row.mapLabel, ru: row.mapLabel, en: row.mapLabel },
    instagram: row.instagram,
    telegram: row.telegram,
    facebook: row.facebook
  };
}

export function leadDto(row: {
  id: string;
  source: string;
  fullName: string;
  phone: string;
  message: string | null;
  productSlug: string | null;
  productName: string | null;
  lang: string | null;
  status: string;
  note: string | null;
  createdAt: Date;
}) {
  return {
    id: row.id,
    source: row.source,
    fullName: row.fullName,
    phone: row.phone,
    message: row.message,
    productSlug: row.productSlug,
    productName: row.productName,
    lang: row.lang,
    status: row.status,
    note: row.note,
    createdAt: row.createdAt.toISOString()
  };
}
