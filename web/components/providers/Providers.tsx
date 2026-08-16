// App-wide providers: i18n instance for the current locale, the toast host,
// the shared order modal and the anonymous visit beacon.

"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import { createI18n } from "@/lib/i18n/createInstance";
import { ToastHost } from "@/components/ui/Toast";
import { OrderModal } from "@/components/layout/OrderModal";
import { reportPageView } from "@/lib/visitor";
import type { Lang } from "@/lib/types";

export function Providers({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const pathname = usePathname();
  const [i18n] = useState(() => createI18n(lang));
  const firstPath = useRef<string | null>(null);

  useEffect(() => {
    if (i18n.language !== lang) void i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
  }, [i18n, lang]);

  useEffect(() => {
    // Report every navigation, but never the same URL twice in a row.
    if (firstPath.current === pathname) return;
    firstPath.current = pathname;
    reportPageView(lang);
  }, [pathname, lang]);

  return (
    <I18nextProvider i18n={i18n}>
      {children}
      <ToastHost />
      <OrderModal lang={lang} />
    </I18nextProvider>
  );
}
