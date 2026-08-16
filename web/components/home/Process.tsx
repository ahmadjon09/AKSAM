// How the partnership works: four numbered steps on a thin connecting line
// that draws itself across as the section reveals.

"use client";

import { useTranslation } from "react-i18next";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { localized, PROCESS_STEPS } from "@/lib/content";
import type { Lang } from "@/lib/types";

export function Process({ lang }: { lang: Lang }) {
  const { t } = useTranslation();
  const steps = localized(PROCESS_STEPS, lang);

  return (
    <section className="relative overflow-hidden bg-ink py-20 text-white sm:py-28" id="process">
      <div className="pointer-events-none absolute -left-40 top-0 size-[480px] rounded-full bg-brand/15 blur-[140px]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <SectionHeading eyebrow={t("process.eyebrow")} title={t("process.title")} subtitle={t("process.subtitle")} light />
        <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {steps.map((step, i) => (
            <Reveal key={i} delay={i * 110} as="li" className="relative">
              <div className="group">
                <div className="flex items-center gap-4">
                  <span className="grid size-12 place-items-center rounded-full border border-white/15 bg-white/5 text-lg font-extrabold text-brand transition-all duration-500 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="hidden h-px flex-1 bg-gradient-to-r from-white/25 to-transparent lg:block" />
                </div>
                <h3 className="mt-5 text-lg font-bold tracking-tight">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
