// Terms of Service page. Sections come from the structured content module
// and are fully localized; the layout is a readable single column with a
// red index number per section.

"use client";

import { useTranslation } from "react-i18next";
import { Reveal } from "@/components/ui/Reveal";
import { localized, TERMS_SECTIONS } from "@/lib/content";
import type { Lang } from "@/lib/types";

export function TermsContent({ lang }: { lang: Lang }) {
  const { t } = useTranslation();
  const sections = localized(TERMS_SECTIONS, lang);

  return (
    <div className="pt-28 sm:pt-36">
      <div className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-28 lg:px-12">
        <Reveal className="max-w-3xl">
          <span className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.22em] text-brand">
            <span className="h-px w-8 bg-brand/50" />
            AKSAM
          </span>
          <h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl">
            {t("terms.title")}
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-ink/55">{t("terms.updated")}</p>
        </Reveal>

        <div className="mt-14 max-w-4xl space-y-8">
          {sections.map((section, i) => (
            <Reveal key={i} delay={40}>
              <section className="flex gap-6">
                <span className="w-12 shrink-0 pt-1 text-right text-3xl font-extrabold leading-none text-brand/25">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 border-b border-ink/8 pb-8">
                  <h2 className="text-xl font-bold tracking-tight text-ink">{section.title}</h2>
                  <p className="mt-3 text-[15px] leading-[1.85] text-ink/65">{section.text}</p>
                </div>
              </section>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
