// Sticky header with two states:
//  - "over hero" (home page, top of scroll): transparent, light text
//  - solid: white blurred bar with dark text (after scrolling or on any
//    inner page, where the top of the page is always light).
// Breakpoints are tuned so the row never overflows: nav from xl, phone from
// lg, CTA from md. The logo sits on a white plate so it stays visible over
// the dark hero too.

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Logo } from "@/components/ui/Logo";
import { LangSwitcher } from "./LangSwitcher";
import { useScrolled } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/lib/store/ui";
import { LANGS } from "@/lib/i18n";
import type { Lang } from "@/lib/types";

export function Header({ lang, phone }: { lang: Lang; phone: string }) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const scrolled = useScrolled(10);
  const [menuOpen, setMenuOpen] = useState(false);
  const openOrder = useUiStore((s) => s.openOrder);

  const navItems = [
    { key: "home", href: `/${lang}` },
    { key: "products", href: `/${lang}/products` },
    { key: "about", href: `/${lang}/about` },
    { key: "locations", href: `/${lang}/locations` },
    { key: "contact", href: `/${lang}/contact` }
  ];

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Strip any locale prefix to decide which item is active.
  const cleanPath = pathname.replace(new RegExp(`^/(${LANGS.join("|")})`), "") || "/";
  const isHome = cleanPath === "/";
  const isActive = (href: string) => {
    const cleanHref = href.replace(new RegExp(`^/(${LANGS.join("|")})`), "");
    if (cleanHref === "/") return cleanPath === "/";
    return cleanPath === cleanHref || cleanPath.startsWith(cleanHref + "/");
  };

  // Over the dark hero the header is transparent with light text; once the
  // user scrolls (or the menu opens) it turns into the solid white bar.
  const overHero = isHome && !scrolled && !menuOpen;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          overHero
            ? "bg-transparent"
            : "bg-white/90 shadow-[0_1px_0_rgba(0,0,0,0.06),0_12px_40px_-24px_rgba(0,0,0,0.25)] backdrop-blur-xl"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-5 sm:h-[72px] sm:px-8 lg:px-12">
          <Link href={`/${lang}`} aria-label="AKSAM — bosh sahifa" className="relative z-10 shrink-0">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Main">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "relative rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? overHero
                      ? "text-white"
                      : "text-brand"
                    : overHero
                      ? "text-white/75 hover:text-white"
                      : "text-ink/70 hover:text-ink"
                )}
              >
                {t(`nav.${item.key}`)}
                {isActive(item.href) && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-3 -bottom-[3px] h-[2px] rounded-full bg-brand"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <LangSwitcher current={lang} light={overHero} />
            <a
              href={`tel:${phone.replace(/[^\d+]/g, "")}`}
              className={cn(
                "hidden items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors lg:inline-flex",
                overHero ? "border-white/25 text-white hover:bg-white/10" : "border-ink/10 text-ink hover:border-ink/30"
              )}
            >
              <Phone className="size-3.5" />
              {phone}
            </a>
            <button
              onClick={() => openOrder()}
              className="hidden h-10 items-center rounded-full bg-brand px-5 text-sm font-semibold text-white shadow-[0_8px_24px_-10px_rgba(200,16,46,0.6)] transition-all hover:-translate-y-px hover:bg-brand-dark md:inline-flex"
            >
              {t("nav.order")}
            </button>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? t("common.close") : t("common.openMenu")}
              aria-expanded={menuOpen}
              className={cn(
                "grid size-10 place-items-center rounded-full border transition-colors xl:hidden",
                overHero ? "border-white/30 text-white hover:bg-white/10" : "border-ink/10 text-ink hover:border-ink/30"
              )}
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-white xl:hidden"
          >
            <div className="flex h-full flex-col justify-between px-6 pb-10 pt-28">
              <nav className="flex flex-col gap-1" aria-label="Mobile">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.05, duration: 0.35, ease: "easeOut" }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-baseline gap-4 border-b border-ink/8 py-4",
                        isActive(item.href) ? "text-brand" : "text-ink"
                      )}
                    >
                      <span className="text-xs font-semibold tabular-nums text-ink/35">0{i + 1}</span>
                      <span className="text-2xl font-semibold tracking-tight">{t(`nav.${item.key}`)}</span>
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    openOrder();
                  }}
                  className="h-12 w-full rounded-full bg-brand text-[15px] font-semibold text-white"
                >
                  {t("nav.order")}
                </button>
                <a
                  href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-ink/15 text-[15px] font-semibold text-ink"
                >
                  <Phone className="size-4" />
                  {phone}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
