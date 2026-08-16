// Home hero. The imagery is a full-bleed editorial photo with a layered
// structure: dark scrim, oversized display type, and a thin brand-red rule.
// Entrance choreography runs on a GSAP timeline registered to ScrollTrigger,
// so the panel sweeps away once the user scrolls. Reduced-motion users get
// an instant, static layout instead.

"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "react-i18next";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { useUiStore } from "@/lib/store/ui";
import { HERO_STATS, localized } from "@/lib/content";
import type { Lang } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

export function Hero({ lang }: { lang: Lang }) {
  const { t } = useTranslation();
  const openOrder = useUiStore((s) => s.openOrder);
  const reduced = usePrefersReducedMotion();
  const scope = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(scope);
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(q("[data-hero-line]"), { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.12 }, 0.15)
        .fromTo(q("[data-hero-sub]"), { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, 0.55)
        .fromTo(q("[data-hero-cta]"), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.75)
        .fromTo(q("[data-hero-rule]"), { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "power2.inOut" }, 0.4);

      // Gentle parallax: the image drifts as the user scrolls away.
      gsap.to(q("[data-hero-img]"), {
        yPercent: 14,
        ease: "none",
        scrollTrigger: { trigger: scope.current, start: "top top", end: "bottom top", scrub: true }
      });
    }, scope);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={scope} className="relative flex items-end overflow-hidden bg-ink text-white">
      <div className="absolute inset-0 overflow-hidden">
        <Image
          data-hero-img
          src="/images/hero-main.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          quality={82}
          className="scale-110 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/45 via-transparent to-transparent" />
      </div>
      <div className="relative mx-auto w-full max-w-7xl px-4 pt-20 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        <p data-hero-line className="text-[12px] font-bold uppercase tracking-[0.24em] text-white/70 sm:text-[13px]">
          {t("hero.eyebrow")}
        </p>
        <h1 className="mt-4 max-w-4xl text-[44px] font-extrabold leading-[1.02] tracking-tight sm:text-7xl lg:text-[92px]">
          <span data-hero-line className="block">{t("hero.titleLine1")}</span>
          <span data-hero-line className="block text-brand">{t("hero.titleAccent")}</span>
        </h1>
        <p data-hero-sub className="mt-6 max-w-xl text-[15px] leading-relaxed text-white/75 sm:text-lg">
          {t("hero.subtitle")}
        </p>
        <div data-hero-cta className="mt-9 flex flex-wrap items-center gap-3.5">
          <button
            onClick={() => openOrder()}
            className="group inline-flex h-13 items-center gap-2.5 rounded-full bg-brand px-8 text-[15px] font-semibold text-white shadow-[0_16px_44px_-14px_rgba(200,16,46,0.75)] transition-all hover:-translate-y-0.5 hover:bg-brand-dark"
          >
            {t("hero.ctaPrimary")}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </button>
          <Link
            href={`/${lang}/products`}
            className="inline-flex h-13 items-center gap-2.5 rounded-full border border-white/25 px-8 text-[15px] font-semibold text-white backdrop-blur-sm transition-all hover:border-white/60 hover:bg-white/10"
          >
            {t("hero.ctaSecondary")}
          </Link>
        </div>

        <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-white/15 pt-8 sm:grid-cols-4">
          {localized(HERO_STATS, lang).map((stat, idx) => (
            <div key={idx}>
              <dd className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{stat.value}</dd>
              <dt className="mt-1.5 text-[12.5px] leading-snug text-white/55">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </div>

      <div className="absolute bottom-8 right-6 hidden items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40 md:flex">
        {t("hero.scroll")}
        <ArrowDown className="size-3.5" />
      </div>
    </section>
  );
}
