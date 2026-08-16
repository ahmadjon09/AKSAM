// Product lines section: three editorial cards with a red reveal frame on
// hover. Clicking a card opens the catalog pre-filtered to that line.

"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { blurPlaceholder } from "@/lib/utils";
import type { CategoryDto, Lang, ProductDto } from "@/lib/types";

export function Categories({ lang, categories, products }: { lang: Lang; categories: CategoryDto[]; products: ProductDto[] }) {
  const { t } = useTranslation();

  return (
    <section className="bg-white py-20 sm:py-28" id="categories">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <SectionHeading eyebrow={t("categories.eyebrow")} title={t("categories.title")} subtitle={t("categories.subtitle")} />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => {
            const count = products.filter((p) => p.category?.slug === cat.slug).length;
            return (
              <Reveal key={cat.id} delay={i * 90} className="h-full">
                <Link
                  href={`/${lang}/products?category=${cat.slug}`}
                  className="group relative block aspect-[4/5] overflow-hidden rounded-xl bg-ink shadow-[0_24px_60px_-30px_rgba(0,0,0,0.4)]"
                >
                  {cat.image && (
                    <Image
                      src={cat.image}
                      alt={cat.name[lang] || cat.name.uz}
                      fill
                      sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                      placeholder="blur"
                      blurDataURL={blurPlaceholder(cat.id)}
                      className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-transparent" />
                  <span className="pointer-events-none absolute inset-3 rounded-lg border border-white/0 transition-all duration-500 group-hover:border-brand/80" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
                    <div>
                      <h3 className="text-xl font-bold tracking-tight text-white sm:text-2xl">{cat.name[lang] || cat.name.uz}</h3>
                      <p className="mt-2 line-clamp-2 max-w-[26ch] text-[13px] leading-relaxed text-white/65">
                        {cat.description[lang] || cat.description.uz}
                      </p>
                      <p className="mt-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-white/45">
                        {count} {t("categories.productsCount")}
                      </p>
                    </div>
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition-all duration-500 group-hover:bg-brand">
                      <ArrowUpRight className="size-4.5 transition-transform duration-500 group-hover:rotate-45" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
