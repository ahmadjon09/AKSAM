// Quality pillars: four guarantees with lucide icons inside red keyline
// cards. No imagery here on purpose — this section is about credibility.

"use client";

import { BadgeCheck, CalendarClock, Factory, Truck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { CRAFT_ITEMS, localized } from "@/lib/content";
import type { Lang } from "@/lib/types";

const ICONS = [Factory, BadgeCheck, CalendarClock, Truck];

export function Craft({ lang }: { lang: Lang }) {
  const { t } = useTranslation();
  const items = localized(CRAFT_ITEMS, lang);

  return (
    <section className="bg-paper py-20 sm:py-28" id="craft">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <SectionHeading eyebrow={t("craft.eyebrow")} title={t("craft.title")} subtitle={t("craft.subtitle")} />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <Reveal key={i} delay={i * 90} className="h-full">
                <div className="group h-full rounded-xl border border-ink/8 bg-white p-7 transition-all duration-500 hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_28px_60px_-32px_rgba(200,16,46,0.35)]">
                  <span className="grid size-12 place-items-center rounded-lg bg-brand/8 text-brand transition-colors duration-500 group-hover:bg-brand group-hover:text-white">
                    <Icon className="size-5.5" strokeWidth={1.9} />
                  </span>
                  <h3 className="mt-5 text-[17px] font-bold tracking-tight text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/55">{item.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
