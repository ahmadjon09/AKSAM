// About page: story, values, team and the numbers that back the claims.
// Copy comes from the translation dictionaries plus the structured content
// module (values / team / stats).

"use client";

import { useTranslation } from "react-i18next";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ABOUT_VALUES, HERO_STATS, localized, TEAM } from "@/lib/content";
import { initialsOf } from "@/lib/utils";
import type { Lang } from "@/lib/types";

export function AboutPageContent({ lang }: { lang: Lang }) {
  const { t } = useTranslation();
  const values = localized(ABOUT_VALUES, lang);
  const team = localized(TEAM, lang);
  const stats = localized(HERO_STATS, lang);

  return (
    <div className="pt-28 sm:pt-36">
      {/* Intro */}
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <Reveal>
          <span className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.22em] text-brand">
            <span className="h-px w-8 bg-brand/50" />
            {t("about.heroEyebrow")}
          </span>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            {t("about.heroTitle")}
          </h1>
          <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-ink/60">{t("about.heroText")}</p>
        </Reveal>
      </div>

      {/* Numbers band */}
      <Reveal className="mx-auto mt-16 max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-ink/10 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white px-8 py-10 text-center">
              <p className="text-4xl font-extrabold tracking-tight text-brand sm:text-5xl">{stat.value}</p>
              <p className="mt-2 text-[13px] font-medium uppercase tracking-wide text-ink/50">{stat.label}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <SectionHeading eyebrow={t("about.valuesEyebrow")} title={t("about.valuesTitle")} />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, i) => (
            <Reveal key={i} delay={i * 90} className="h-full">
              <div className="group h-full rounded-xl border border-ink/8 bg-paper p-7 transition-all duration-500 hover:-translate-y-1 hover:border-brand/40 hover:bg-white hover:shadow-[0_28px_60px_-32px_rgba(200,16,46,0.3)]">
                <span className="block text-4xl font-extrabold text-brand/25 transition-colors duration-500 group-hover:text-brand">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="mt-4 text-[17px] font-bold tracking-tight text-ink">{value.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink/55">{value.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="bg-paper py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <SectionHeading eyebrow={t("about.teamEyebrow")} title={t("about.teamTitle")} />
          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {team.map((member, i) => (
              <Reveal key={i} delay={i * 110} className="h-full">
                <div className="flex h-full flex-col items-start rounded-xl border border-ink/8 bg-white p-7">
                  <span className="grid size-14 place-items-center rounded-full bg-brand/10 text-lg font-bold text-brand">
                    {initialsOf(member.name)}
                  </span>
                  <h3 className="mt-5 text-lg font-bold tracking-tight text-ink">{member.name}</h3>
                  <p className="mt-1 text-[13px] font-semibold uppercase tracking-[0.12em] text-brand">{member.role}</p>
                  <p className="mt-3 text-sm leading-relaxed text-ink/55">{member.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
