// App-wide providers: i18n instance for the current locale, session data
// hydration, the toast host, the shared order modal and the visit beacon.
// Mounted once in the root layout, so nothing here remounts on navigation.

"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import { createI18n } from "@/lib/i18n/createInstance";
import { ToastHost } from "@/components/ui/Toast";
import { OrderModal } from "@/components/layout/OrderModal";
import { reportPageView } from "@/lib/visitor";
import { ensureHydrated } from "@/lib/data/store";
import { useUiStore } from "@/lib/store/ui";
import type { Lang } from "@/lib/types";

export function Providers({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const pathname = usePathname();
  const [i18n] = useState(() => createI18n(lang));
  const firstPath = useRef<string | null>(null);
  const closeOrder = useUiStore((s) => s.closeOrder);

  // Keep the i18n instance in sync with the URL locale — same instance,
  // only the language changes, so the switch is instant.
  useEffect(() => {
    if (i18n.language !== lang) void i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
  }, [i18n, lang]);

  // One-time background hydration of products/categories/settings.
  useEffect(() => {
    ensureHydrated();
  }, []);

  useEffect(() => {
    // Report every navigation, but never the same URL twice in a row.
    if (firstPath.current === pathname) return;
    firstPath.current = pathname;
    reportPageView(lang);
    closeOrder();
  }, [pathname, lang, closeOrder]);

  return (
    <I18nextProvider i18n={i18n}>
      {children}
      <ToastHost />
      <OrderModal lang={lang} />
    </I18nextProvider>
  );
}
