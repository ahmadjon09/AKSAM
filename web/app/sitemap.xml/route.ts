// sitemap.xml — generated at request time so new products appear without a
// redeploy. Every URL carries its three hreflang alternates (uz/ru/en).

import { fetchProductsServer } from "@/lib/api";
import { LANGS, siteUrl } from "@/lib/seo";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const STATIC_PATHS = ["", "/products", "/about", "/contact", "/locations", "/terms"];

export async function GET() {
  const base = siteUrl();
  const products = await fetchProductsServer();
  const entries: string[] = [];

  const alternates = (path: string) =>
    LANGS.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${base}/${l}${path}"/>`).join("\n");

  for (const lang of LANGS) {
    for (const path of STATIC_PATHS) {
      const loc = `${base}/${lang}${path}`;
      entries.push(`  <url>\n    <loc>${loc}</loc>\n${alternates(path)}\n  </url>`);
    }
    for (const product of products) {
      const path = `/products/${product.slug}`;
      const loc = `${base}/${lang}${path}`;
      const lastmod = product.updatedAt ? product.updatedAt.slice(0, 10) : "";
      entries.push(
        `  <url>\n    <loc>${loc}</loc>\n${lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ""}${alternates(path)}\n  </url>`
      );
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join("\n")}\n</urlset>\n`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, s-maxage=3600" }
  });
}
