// Locale middleware. Runs on the edge (Cloudflare Workers in production):
//  1. Requests with a locale prefix pass through and get the locale cookie.
//  2. Requests without one are redirected to /uz /ru /en, detected from the
//     cookie first, then Accept-Language, defaulting to uz.
//  3. Public pages get an edge-cache hint; /admin is always no-store.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const LANGS = ["uz", "ru", "en"];
const COOKIE = "aksam_lang";

export const config = {
  matcher: ["/((?!_next/|images/|brand/|favicon.ico|icon.svg|robots.txt|sitemap.xml|manifest.webmanifest|.*\\..*).*)"]
};

function langCookie(res: NextResponse, lang: string) {
  res.cookies.set(COOKIE, lang, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const res = NextResponse.next();
    res.headers.set("Cache-Control", "no-store, max-age=0");
    return res;
  }

  const seg = pathname.split("/")[1];
  if (LANGS.includes(seg)) {
    const res = NextResponse.next();
    // Semi-static edge caching: the worker renders on demand, Cloudflare
    // serves it for 5 minutes and revalidates in the background afterwards.
    res.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=86400");
    langCookie(res, seg);
    return res;
  }

  let lang = "uz";
  const cookie = req.cookies.get(COOKIE)?.value;
  if (cookie && LANGS.includes(cookie)) {
    lang = cookie;
  } else {
    const header = (req.headers.get("accept-language") || "").toLowerCase();
    const direct = header.match(/^(uz|ru|en)[-_]/)?.[1];
    const any = header
      .split(",")
      .map((p) => p.split(";")[0].trim().slice(0, 2))
      .find((code) => LANGS.includes(code));
    lang = direct ?? any ?? "uz";
  }

  const url = req.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${lang}` : `/${lang}${pathname}`;
  const res = NextResponse.redirect(url);
  langCookie(res, lang);
  return res;
}
