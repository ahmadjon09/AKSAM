// Admin providers: its own i18n instance (namespace "admin", stored language
// in localStorage, defaulting to Russian), the auth store bootstrap, the
// toast host and the route guard.

"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { I18nextProvider } from "react-i18next";
import type { i18n as I18nInstance } from "i18next";
import { createI18n } from "@/lib/i18n/createInstance";
import { ToastHost } from "@/components/ui/Toast";
import { useAuthStore } from "@/lib/store/auth";
import type { Lang } from "@/lib/types";

const LANG_KEY = "aksam_admin_lang";
const PUBLIC_LANGS: Lang[] = ["uz", "ru", "en"];

function initialLang(): Lang {
  if (typeof window === "undefined") return "ru";
  const saved = window.localStorage.getItem(LANG_KEY);
  return PUBLIC_LANGS.includes(saved as Lang) ? (saved as Lang) : "ru";
}

export function AdminProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [lang, setLang] = useState<Lang>(initialLang);
  const [i18n] = useState<I18nInstance>(() => createI18n(initialLang(), "admin"));
  const booted = useAuthStore((s) => s.booted);
  const user = useAuthStore((s) => s.user);
  const init = useAuthStore((s) => s.init);

  useEffect(() => {
    void init();
  }, [init]);

  useEffect(() => {
    if (!booted) return;
    const onLogin = pathname === "/admin/login" || pathname === "/admin";
    if (!user && !onLogin) {
      router.replace("/admin/login");
    }
  }, [booted, user, pathname, router]);

  const changeLang = (l: Lang) => {
    setLang(l);
    void i18n.changeLanguage(l);
    if (typeof window !== "undefined") window.localStorage.setItem(LANG_KEY, l);
  };

  if (!booted) {
    return (
      <div className="grid min-h-screen place-items-center bg-neutral-100">
        <div className="size-8 animate-spin rounded-full border-2 border-neutral-300 border-t-brand" />
      </div>
    );
  }

  return (
    <I18nextProvider i18n={i18n}>
      {children}
      <ToastHost />
      <LangDock lang={lang} onChange={changeLang} />
    </I18nextProvider>
  );
}

// Small floating language switch, visible on every admin screen including
// the login page.
function LangDock({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  return (
    <div className="fixed bottom-4 left-4 z-50 flex overflow-hidden rounded-full border border-ink/10 bg-white shadow-lg">
      {PUBLIC_LANGS.map((l) => (
        <button
          key={l}
          onClick={() => onChange(l)}
          className={`px-3 py-1.5 text-[11.5px] font-bold uppercase transition-colors ${
            l === lang ? "bg-brand text-white" : "text-ink/50 hover:text-ink"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
