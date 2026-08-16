// Site footer: contact block, quick navigation, working hours and the
// language switch. Rendered on every public page inside [lang] layout.

"use client";

import Link from "next/link";
import { ArrowUp, Mail, MapPin, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Logo } from "@/components/ui/Logo";
import { pickText } from "@/lib/seo";
import type { Lang, PublicSettingsDto } from "@/lib/types";

export function Footer({ lang, settings }: { lang: Lang; settings: PublicSettingsDto }) {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  const phoneHref = `tel:${settings.phone.replace(/[^\d+]/g, "")}`;

  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      <div className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-brand/20 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6 sm:pt-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
          <div className="space-y-5">
            <Logo />
            <p className="max-w-sm text-sm leading-relaxed text-white/55">{t("footer.tagline")}</p>
            <div className="flex gap-3">
              {settings.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid size-10 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/40 hover:text-white"
                  aria-label="Instagram"
                >
                  <InstagramIcon />
                </a>
              )}
              {settings.telegram && (
                <a
                  href={settings.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid size-10 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/40 hover:text-white"
                  aria-label="Telegram"
                >
                  <TelegramIcon />
                </a>
              )}
              {settings.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid size-10 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/40 hover:text-white"
                  aria-label="Facebook"
                >
                  <TelegramIcon />
                </a>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-[13px] font-semibold uppercase tracking-[0.18em] text-white/40">{t("footer.navTitle")}</h3>
            <ul className="mt-5 space-y-3">
              {[
                { key: "home", href: `/${lang}` },
                { key: "products", href: `/${lang}/products` },
                { key: "about", href: `/${lang}/about` },
                { key: "locations", href: `/${lang}/locations` },
                { key: "contact", href: `/${lang}/contact` },
                { key: "terms", href: `/${lang}/terms` }
              ].map((item) => (
                <li key={item.key}>
                  <Link href={item.href} className="text-sm text-white/70 transition-colors hover:text-white">
                    {t(`nav.${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[13px] font-semibold uppercase tracking-[0.18em] text-white/40">{t("footer.contactsTitle")}</h3>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              <li>
                <a href={phoneHref} className="flex items-start gap-2.5 transition-colors hover:text-white">
                  <Phone className="mt-0.5 size-4 shrink-0 text-brand" />
                  {settings.phone}
                </a>
              </li>
              {settings.email && (
                <li>
                  <a href={`mailto:${settings.email}`} className="flex items-start gap-2.5 transition-colors hover:text-white">
                    <Mail className="mt-0.5 size-4 shrink-0 text-brand" />
                    {settings.email}
                  </a>
                </li>
              )}
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand" />
                <span>{pickText(settings.address, lang)}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[13px] font-semibold uppercase tracking-[0.18em] text-white/40">{t("footer.hoursTitle")}</h3>
            <p className="mt-5 text-sm text-white/70">{pickText(settings.workHours, lang)}</p>
            <p className="mt-2 text-[13px] text-white/40">{settings.siteName} · {year}</p>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-[13px] text-white/40">
            © {year} {settings.siteName}. {t("footer.rights")}.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-white/60 transition-colors hover:text-white"
          >
            {t("footer.backToTop")}
            <ArrowUp className="size-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4.5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4.5" fill="currentColor">
      <path d="M21.6 4.2 18.7 19c-.2 1-.8 1.2-1.6.8l-4.6-3.4-2.2 2.1c-.3.3-.5.5-1 .5l.3-4.7 8.5-7.7c.4-.3-.1-.5-.6-.2L7.1 12.9 2.6 11.5c-1-.3-1-1 .2-1.4L20.3 2.8c.8-.3 1.5.2 1.3 1.4Z" />
    </svg>
  );
}
