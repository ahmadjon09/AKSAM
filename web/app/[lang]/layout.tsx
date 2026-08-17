// Minimal layout for the locale segment: its only job is to prerender the
// three locales at build time, so every page under [lang] becomes a fully
// static route (instant navigation, Cloudflare-compatible). The header,
// footer and providers live in the ROOT layout and persist across language
// switches.

import { LANGS } from "@/lib/seo";

// All three locales are enumerated, so unknown locale paths fall straight
// to 404 instead of creating a dynamic fallback function.
export const dynamicParams = false;

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export default function LangLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
