// Brand story teaser: split layout with the loom photograph and the story
// copy, plus the key numbers from the factory floor.

"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Reveal } from "@/components/ui/Reveal";
import { blurPlaceholder } from "@/lib/utils";
import type { Lang } from "@/lib/types";

export function Story({ lang }: { lang: Lang }) {
  const { t } = useTranslation();

  return (
    <section className="bg-white py-20 sm:py-28" id="story">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
        <Reveal from="left" className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
            <Image
              src="/images/about-loom.jpg"
              alt={t("story.title")}
              fill
              sizes="(min-width:1024px) 45vw, 100vw"
              placeholder="blur"
              blurDataURL={blurPlaceholder("story")}
              className="object-cover"
            />
          </div>
          {/* Signature red frame offset behind the photo */}
          <div className="absolute -bottom-6 left-6 rounded-lg bg-ink px-6 py-4 text-white shadow-xl">
            <p className="text-3xl font-extrabold leading-none">2020</p>
            <p className="mt-1 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-white/60">{t("hero.eyebrow")}</p>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.22em] text-brand">
              <span className="h-px w-8 bg-brand/50" />
              {t("story.eyebrow")}
            </span>
            <h2 className="mt-4 text-3xl font-bold leading-[1.08] tracking-tight text-ink sm:text-4xl lg:text-[44px]">
              {t("story.title")}
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="mt-6 text-[15px] leading-relaxed text-ink/65 sm:text-base">{t("story.p1")}</p>
            <p className="mt-4 text-[15px] leading-relaxed text-ink/65 sm:text-base">{t("story.p2")}</p>
          </Reveal>
          <Reveal delay={180}>
            <Link
              href={`/${lang}/about`}
              className="group mt-8 inline-flex items-center gap-2 border-b-2 border-brand pb-1 text-sm font-bold text-ink transition-colors hover:text-brand"
            >
              {t("story.link")}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
