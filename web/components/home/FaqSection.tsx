// FAQ accordion: one item open at a time, animated height via CSS grid
// rows, chevron rotates on open. Questions/answers come from content.ts.

"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { FAQ_ITEMS, localized } from "@/lib/content";
import { cn } from "@/lib/utils";
import type { Lang } from "@/lib/types";

export function FaqSection({ lang }: { lang: Lang }) {
  const { t } = useTranslation();
  const items = localized(FAQ_ITEMS, lang);
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-paper py-20 sm:py-28" id="faq">
      <div className="mx-auto max-w-4xl px-5 sm:px-8 lg:px-12">
        <SectionHeading eyebrow={t("faq.eyebrow")} title={t("faq.title")} subtitle={t("faq.subtitle")} align="center" />
        <div className="mt-12 space-y-3">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={i} delay={i * 60}>
                <div
                  className={cn(
                    "overflow-hidden rounded-xl border bg-white transition-all duration-300",
                    isOpen ? "border-brand/40 shadow-[0_20px_50px_-30px_rgba(200,16,46,0.4)]" : "border-ink/8 hover:border-ink/20"
                  )}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="text-[15.5px] font-bold tracking-tight text-ink">{item.q}</span>
                    <span
                      className={cn(
                        "grid size-8 shrink-0 place-items-center rounded-full border transition-all duration-300",
                        isOpen ? "rotate-180 border-brand bg-brand text-white" : "border-ink/15 text-ink/50"
                      )}
                    >
                      <ChevronDown className="size-4" />
                    </span>
                  </button>
                  <div
                    className={cn(
                      "grid transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-6 text-[14.5px] leading-relaxed text-ink/60">{item.a}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
