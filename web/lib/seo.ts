// SEO builders: canonical URLs, hreflang alternates, OG/Twitter tags and
// JSON-LD blocks. Everything is locale-aware and per-product on detail pages.

import type { Metadata } from "next";
import type { Lang, LocalizedText, ProductDto, PublicSettingsDto } from "./types";

export const LANGS: Lang[] = ["uz", "ru", "en"];

export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://aksam.uz").replace(/\/+$/, "");
}

export function pathWithoutLang(pathname: string, lang: Lang): string {
  return pathname.replace(new RegExp(`^/${lang}`), "") || "/";
}

export function localizePath(pathname: string, lang: Lang): string {
  return `/${lang}${pathWithoutLang(pathname, lang)}`;
}

export function alternatesFor(pathname: string, lang: Lang) {
  const path = pathWithoutLang(pathname, lang);
  return {
    canonical: `${siteUrl()}${path === "/" ? `/${lang}` : `/${lang}${path}`}`,
    languages: Object.fromEntries(LANGS.map((l) => [l, `${siteUrl()}/${l}${path}`]))
  };
}

export function pickText(text: LocalizedText | undefined, lang: Lang): string {
  if (!text) return "";
  return text[lang] || text.uz;
}

export function buildPageMetadata(params: {
  lang: Lang;
  pathname: string;
  title: string;
  description: string;
  ogImage?: string;
}): Metadata {
  const ogImage = params.ogImage ?? "/images/og-default.jpg";
  const { lang, pathname, title, description } = params;
  const path = pathWithoutLang(pathname, lang);
  const url = `${siteUrl()}/${lang}${path}`;
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(LANGS.map((l) => [l, `${siteUrl()}/${l}${path}`]))
    },
    openGraph: {
      type: "website",
      locale: lang === "uz" ? "uz_UZ" : lang === "ru" ? "ru_RU" : "en_US",
      siteName: "AKSAM",
      title,
      description,
      url,
      images: ogImage ? [{ url: absoluteImage(ogImage), width: 1200, height: 630, alt: title }] : undefined
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description,
      images: ogImage ? [absoluteImage(ogImage)] : undefined
    }
  };
}

export function absoluteImage(src: string): string {
  if (/^https?:\/\//.test(src)) return src;
  return `${siteUrl()}${src.startsWith("/") ? "" : "/"}${src}`;
}

export function organizationJsonLd(settings: PublicSettingsDto) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.siteName || "AKSAM",
    url: siteUrl(),
    telephone: settings.phone,
    email: settings.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: pickText(settings.address, "uz"),
      addressLocality: "Namangan",
      addressRegion: "Namangan region",
      addressCountry: "UZ"
    },
    geo: { "@type": "GeoCoordinates", latitude: settings.mapLat, longitude: settings.mapLng }
  };
}

export function productJsonLd(product: ProductDto, lang: Lang) {
  // Deliberately no offers/price — AKSAM sells to order only.
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: pickText(product.name, lang),
    description: pickText(product.short, lang),
    image: product.images.map(absoluteImage),
    brand: { "@type": "Brand", name: "AKSAM" },
    additionalProperty: (product.specs[lang] ?? product.specs.uz).map((spec) => ({
      "@type": "PropertyValue",
      name: spec.label,
      value: spec.value
    })),
    category: product.category ? pickText(product.category.name, lang) : undefined,
    url: `${siteUrl()}/${lang}/products/${product.slug}`
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${siteUrl()}${item.path}`
    }))
  };
}
