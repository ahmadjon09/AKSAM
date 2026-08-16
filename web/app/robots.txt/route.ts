// robots.txt: public routes open for crawlers, /admin closed. The sitemap
// index is advertised for all locales at once.

export const runtime = "edge";
export const dynamic = "force-dynamic";

export function GET() {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://aksam.uz").replace(/\/+$/, "");
  const body = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /admin",
    "",
    `Sitemap: ${base}/sitemap.xml`,
    ""
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, s-maxage=3600" }
  });
}
