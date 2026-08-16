// Client quotes from the old site's real partners. Large quotation mark in
// brand red, generous whitespace, staggered reveal.

"use client";

import { useTranslation } from "react-i18next";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { localized, TESTIMONIALS } from "@/lib/content";
import { initialsOf } from "@/lib/utils";
import type { Lang } from "@/lib/types";

export function Testimonials({ lang }: { lang: Lang }) {
  const { t } = useTranslation();
  const quotes = localized(TESTIMONIALS, lang);

  return (
    <section className="bg-white py-20 sm:py-28" id="testimonials">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <SectionHeading eyebrow={t("testimonials.eyebrow")} title={t("testimonials.title")} subtitle={t("testimonials.subtitle")} align="center" />
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {quotes.map((quote, i) => (
            <Reveal key={i} delay={i * 110} className="h-full">
              <figure className="flex h-full flex-col rounded-xl border border-ink/8 bg-paper p-8">
                <svg viewBox="0 0 24 24" className="size-8 fill-brand/85" aria-hidden>
                  <path d="M10.5 5C6.9 6.6 4.7 9.6 4.7 13.4c0 3 1.8 5 4.3 5 2.1 0 3.6-1.5 3.6-3.5 0-1.9-1.3-3.2-3.2-3.2-.3 0-.8.1-.9.1.3-1.8 2-3.8 3.8-4.7L10.5 5Zm9 0c-3.6 1.6-5.8 4.6-5.8 8.4 0 3 1.8 5 4.3 5 2.1 0 3.6-1.5 3.6-3.5 0-1.9-1.3-3.2-3.2-3.2-.3 0-.8.1-.9.1.3-1.8 2-3.8 3.8-4.7L19.5 5Z" />
                </svg>
                <blockquote className="mt-5 flex-1 text-[15px] leading-relaxed text-ink/80">{quote.text}</blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-ink/8 pt-5">
                  <span className="grid size-10 place-items-center rounded-full bg-brand/10 text-[13px] font-bold text-brand">
                    {initialsOf(quote.name)}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-ink">{quote.name}</p>
                    <p className="text-[12.5px] text-ink/50">{quote.company}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
