// Shared content shapes. The API mirrors these, and the bundled fallback
// dataset uses the same structure so the site works even with the API down.

export type Lang = "uz" | "ru" | "en";

export interface LocalizedText {
  uz: string;
  ru: string;
  en: string;
}

export interface SpecItem {
  label: string;
  value: string;
}

export interface CategoryDto {
  id: string;
  slug: string;
  name: LocalizedText;
  description: LocalizedText;
  image: string | null;
  isActive: boolean;
  sortOrder: number;
}

export interface ProductDto {
  id: string;
  slug: string;
  category: { slug: string; name: LocalizedText } | null;
  name: LocalizedText;
  short: LocalizedText;
  description: LocalizedText;
  metaTitle: LocalizedText;
  metaDesc: LocalizedText;
  highlights: { uz: string[]; ru: string[]; en: string[] };
  specs: { uz: SpecItem[]; ru: SpecItem[]; en: SpecItem[] };
  images: string[];
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface PublicSettingsDto {
  siteName: string;
  tagline: LocalizedText;
  phone: string;
  phone2: string;
  email: string;
  address: LocalizedText;
  workHours: LocalizedText;
  mapLat: number;
  mapLng: number;
  mapLabel: LocalizedText;
  instagram: string;
  telegram: string;
  facebook: string;
}

export interface AdminStatsDto {
  visitorsToday: number;
  uniqueToday: number;
  views30d: number;
  unique30d: number;
  newLeads: number;
  productsActive: number;
  productsTotal: number;
  series: { day: string; views: number; uniques: number }[];
  leadsSeries: { day: string; count: number }[];
}

export interface VisitorsDto {
  series: { day: string; views: number; uniques: number }[];
  totalViews: number;
  totalUniques: number;
}

export interface LeadDto {
  id: string;
  source: "ORDER" | "CONTACT";
  fullName: string;
  phone: string;
  message: string | null;
  productSlug: string | null;
  productName: string | null;
  lang: string | null;
  status: "NEW" | "CONTACTED" | "CLOSED" | "SPAM";
  note: string | null;
  createdAt: string;
}

export interface AdminUserDto {
  id: string;
  email: string;
  fullName: string;
  role: "SUPERADMIN" | "ADMIN" | "EDITOR";
}

export interface AuthResponse {
  accessToken: string;
  user: AdminUserDto;
}
