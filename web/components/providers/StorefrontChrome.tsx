// Root-level storefront chrome. Lives in the ROOT layout, outside [lang],
// so the header, footer, providers, order modal and i18n instance persist
// across page navigation AND across language switches — switching uz/ru/en
// only swaps the page content, with zero refresh feel.

"use client";

import { usePathname } from "next/navigation";
import { Providers } from "./Providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import type { Lang } from "@/lib/types";

const LOCALE_RE = /^\/(uz|ru|en)(\/|$)/;

export function StorefrontChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const match = pathname.match(LOCALE_RE);

  // Admin and everything else outside /uz /ru /en renders unwrapped.
  if (!match) return <>{children}</>;

  const lang = match[1] as Lang;
  return (
    <Providers lang={lang}>
      <Header lang={lang} />
      <main className="min-h-screen">{children}</main>
      <Footer lang={lang} />
    </Providers>
  );
}
