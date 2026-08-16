// Product detail content: gallery, localized copy, quality highlights and
// the order form. Related products link across the same category.

"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, ChevronRight, ListChecks, Quote, Ruler, Truck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Gallery } from "@/components/product/Gallery";
import { ProductOrderForm } from "@/components/product/ProductOrderForm";
import { Reveal } from "@/components/ui/Reveal";
import { PROCESS_STEPS, localized } from "@/lib/content";
import { blurPlaceholder } from "@/lib/utils";
import type { Lang, ProductDto } from "@/lib/types";

export function ProductClient({ product, related, lang }: { product: ProductDto; related: ProductDto[]; lang: Lang }) {
  const { t } = useTranslation();
  const name = product.name[lang] || product.name.uz;
  const highlights = product.highlights[lang]?.length ? product.highlights[lang] : product.highlights.uz;
  const specs = product.specs[lang]?.length ? product.specs[lang] : product.specs.uz;
  const steps = localized(PROCESS_STEPS, lang);

  return (
    <div>
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[13.5px] font-semibold text-ink/50">
        <Link href={`/${lang}`} className="transition-colors hover:text-brand">
          {t("product.breadcrumbHome")}
        </Link>
        <ChevronRight className="size-3.5 text-ink/30" />
        <Link href={`/${lang}/products`} className="transition-colors hover:text-brand">
          {t("product.breadcrumbCatalog")}
        </Link>
        <ChevronRight className="size-3.5 text-ink/30" />
        <span className="truncate text-ink/80">{name}</span>
      </nav>
      <div className="mt-3">
        <Link
          href={`/${lang}/products`}
          className="inline-flex items-center gap-2 text-[13.5px] font-semibold text-ink/60 transition-colors hover:text-brand"
        >
          <ArrowLeft className="size-4" />
          {t("product.backToCatalog")}
        </Link>
      </div>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
        <Reveal from="left">
          <Gallery images={product.images} alt={name} />
        </Reveal>

        <Reveal from="right" delay={80}>
          <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-brand">
            {product.category?.name[lang] || ""}
          </p>
          <h1 className="mt-2 text-3xl font-bold leading-[1.1] tracking-tight text-ink sm:text-4xl">
            {name}
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-ink/60 sm:text-base">
            {product.short[lang] || product.short.uz}
          </p>

          <div className="mt-6 flex flex-wrap gap-2.5">
            <span className="inline-flex items-center gap-2 rounded-full bg-ink text-white px-4 py-2 text-[12.5px] font-semibold">
              <Ruler className="size-3.5" />
              {t("catalog.noPrice")}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand/8 px-4 py-2 text-[12.5px] font-semibold text-brand">
              <BadgeCheck className="size-3.5" />
              ISO
            </span>
          </div>

          {highlights.length > 0 && (
            <div className="mt-8">
              <h2 className="text-[13px] font-bold uppercase tracking-[0.18em] text-ink/50">
                {t("product.highlightsTitle")}
              </h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {highlights.map((h, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 rounded-lg border border-ink/8 bg-paper px-3.5 py-3 text-[13.5px] font-medium text-ink/80"
                  >
                    <BadgeCheck className="mt-0.5 size-4 shrink-0 text-brand" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8">
            <ProductOrderForm product={product} lang={lang} />
          </div>
        </Reveal>
      </div>

      <Reveal className="mt-14">
        <h2 className="text-xl font-bold tracking-tight text-ink">{t("product.descriptionTitle")}</h2>
        <div className="mt-4 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <p className="text-[15px] leading-[1.9] text-ink/70">{product.description[lang] || product.description.uz}</p>
          <blockquote className="relative h-fit rounded-xl bg-ink p-6 text-white">
            <Quote className="size-6 fill-brand text-brand" strokeWidth={0} />
            <p className="mt-3 text-[14.5px] font-medium leading-relaxed text-white/85">{t("product.qualityNote")}</p>
          </blockquote>
        </div>
      </Reveal>

      {/* Technical specifications */}
      {specs.length > 0 && (
        <Reveal className="mt-16">
          <h2 className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-ink">
            <ListChecks className="size-5 text-brand" />
            {t("product.specsTitle")}
          </h2>
          <dl className="mt-5 overflow-hidden rounded-xl border border-ink/8">
            {specs.map((spec, i) => (
              <div
                key={i}
                className={i % 2 === 0 ? "grid grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] gap-4 bg-white px-5 py-4 sm:grid-cols-[220px_1fr]" : "grid grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] gap-4 bg-paper px-5 py-4 sm:grid-cols-[220px_1fr]"}
              >
                <dt className="text-[13.5px] font-semibold uppercase tracking-[0.08em] text-ink/45">{spec.label}</dt>
                <dd className="text-[14.5px] font-medium text-ink">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      )}

      {/* Production process */}
      <Reveal className="mt-16">
        <h2 className="text-xl font-bold tracking-tight text-ink">{t("product.processTitle")}</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li key={i} className="relative rounded-xl border border-ink/8 bg-white p-5">
              <span className="text-3xl font-extrabold text-brand/25">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-2 text-[15px] font-bold tracking-tight text-ink">{step.title}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink/55">{step.text}</p>
            </li>
          ))}
        </ol>
      </Reveal>

      {/* Delivery note */}
      <Reveal className="mt-16">
        <div className="flex flex-col items-start gap-4 rounded-2xl bg-ink p-7 text-white sm:flex-row sm:items-center sm:gap-6 sm:p-8">
          <span className="grid size-13 shrink-0 place-items-center rounded-xl bg-brand/15 text-brand">
            <Truck className="size-6" strokeWidth={1.8} />
          </span>
          <div>
            <h2 className="text-lg font-bold tracking-tight">{t("product.deliveryTitle")}</h2>
            <p className="mt-1.5 max-w-2xl text-[14px] leading-relaxed text-white/60">{t("product.deliveryText")}</p>
          </div>
        </div>
      </Reveal>

      {related.length > 0 && (
        <section className="mt-16 border-t border-ink/8 pt-12">
          <h2 className="text-xl font-bold tracking-tight text-ink">{t("product.relatedTitle")}</h2>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {related.slice(0, 4).map((p) => (
              <Link key={p.id} href={`/${lang}/products/${p.slug}`} className="group">
                <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-paper ring-1 ring-ink/5">
                  {p.images[0] && (
                    <Image
                      src={p.images[0]}
                      alt={p.name[lang] || p.name.uz}
                      fill
                      sizes="(min-width:1024px) 25vw, 50vw"
                      placeholder="blur"
                      blurDataURL={blurPlaceholder(p.id)}
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                  )}
                </div>
                <p className="mt-2.5 truncate text-[14px] font-semibold text-ink transition-colors group-hover:text-brand">
                  {p.name[lang] || p.name.uz}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
