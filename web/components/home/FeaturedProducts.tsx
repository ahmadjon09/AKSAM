// Featured product cards. Each card links to the product page and carries a
// quick "order" button that opens the shared modal with the right context.

"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { useUiStore } from "@/lib/store/ui";
import { blurPlaceholder } from "@/lib/utils";
import type { Lang, ProductDto } from "@/lib/types";

export function FeaturedProducts({ lang, products }: { lang: Lang; products: ProductDto[] }) {
  const { t } = useTranslation();
  const openOrder = useUiStore((s) => s.openOrder);
  const featured = products.slice(0, 6);

  return (
    <section className="bg-paper py-20 sm:py-28" id="featured">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow={t("featured.eyebrow")} title={t("featured.title")} subtitle={t("featured.subtitle")} />
          <Reveal delay={120}>
            <Link
              href={`/${lang}/products`}
              className="group inline-flex items-center gap-2 text-sm font-semibold text-ink transition-colors hover:text-brand"
            >
              {t("common.viewAll")}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 min-[1700px]:grid-cols-4 lg:gap-x-8 lg:gap-y-14">
          {featured.map((product, i) => (
            <Reveal key={product.id} delay={(i % 3) * 90}>
              <article className="group">
                <Link
                  href={`/${lang}/products/${product.slug}`}
                  className="relative block aspect-[4/5] overflow-hidden rounded-xl bg-white shadow-[0_18px_44px_-28px_rgba(0,0,0,0.35)] ring-1 ring-ink/5"
                >
                  {product.images[0] && (
                    <Image
                      src={product.images[0]}
                      alt={product.name[lang] || product.name.uz}
                      fill
                      sizes="(min-width:1024px) 33vw, 50vw"
                      placeholder="blur"
                      blurDataURL={blurPlaceholder(product.id)}
                      className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                    />
                  )}
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/25 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <span className="absolute bottom-4 left-4 translate-y-2 rounded-full bg-white/95 px-3.5 py-1.5 text-[12px] font-semibold text-ink opacity-0 shadow-lg backdrop-blur transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    {t("common.learnMore")}
                  </span>
                </Link>
                <div className="mt-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[11.5px] font-bold uppercase tracking-[0.16em] text-brand">
                      {product.category?.name[lang] || ""}
                    </p>
                    <h3 className="mt-1 truncate text-[17px] font-bold tracking-tight text-ink">
                      <Link href={`/${lang}/products/${product.slug}`} className="transition-colors hover:text-brand">
                        {product.name[lang] || product.name.uz}
                      </Link>
                    </h3>
                    <p className="mt-1 line-clamp-2 text-[13.5px] leading-relaxed text-ink/55">
                      {product.short[lang] || product.short.uz}
                    </p>
                  </div>
                  <button
                    onClick={() => openOrder({ slug: product.slug, name: product.name[lang] || product.name.uz })}
                    aria-label={t("catalog.order")}
                    className="mt-1 grid size-10 shrink-0 place-items-center rounded-full border border-ink/12 text-ink transition-all hover:border-brand hover:bg-brand hover:text-white"
                  >
                    <ArrowRight className="size-4" />
                  </button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
