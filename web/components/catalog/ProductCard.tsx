// Catalog product card: image with hover zoom, category eyebrow, name and a
// quality-note line instead of a price. The order button opens the shared
// modal pre-filled with this product.

"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Ruler } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useUiStore } from "@/lib/store/ui";
import { blurPlaceholder } from "@/lib/utils";
import type { Lang, ProductDto } from "@/lib/types";

export function ProductCard({ product, lang }: { product: ProductDto; lang: Lang }) {
  const { t } = useTranslation();
  const openOrder = useUiStore((s) => s.openOrder);
  const name = product.name[lang] || product.name.uz;

  return (
    <article className="group flex h-full flex-col">
      <Link
        href={`/${lang}/products/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden rounded-xl bg-paper ring-1 ring-ink/5 transition-shadow duration-500 group-hover:shadow-[0_26px_60px_-30px_rgba(0,0,0,0.4)]"
      >
        {product.images[0] && (
          <Image
            src={product.images[0]}
            alt={name}
            fill
            sizes="(min-width:1024px) 33vw, 50vw"
            placeholder="blur"
            blurDataURL={blurPlaceholder(product.id)}
            className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.045]"
          />
        )}
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <span className="absolute right-4 top-4 grid size-10 translate-y-1 place-items-center rounded-full bg-white/95 text-ink opacity-0 shadow-lg transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="size-4" />
        </span>
      </Link>

      <div className="flex flex-1 flex-col pt-4">
        <p className="truncate text-[11px] font-bold uppercase tracking-[0.16em] text-brand">
          {product.category?.name[lang] || ""}
        </p>
        <h3 className="mt-1.5 text-[17px] font-bold leading-snug tracking-tight text-ink">
          <Link href={`/${lang}/products/${product.slug}`} className="transition-colors hover:text-brand">
            {name}
          </Link>
        </h3>
        <p className="mt-1.5 line-clamp-2 flex-1 text-[13.5px] leading-relaxed text-ink/55">
          {product.short[lang] || product.short.uz}
        </p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-ink/45">
            <Ruler className="size-3.5" />
            {t("catalog.noPrice")}
          </span>
          <button
            onClick={() => openOrder({ slug: product.slug, name })}
            className="inline-flex h-9 items-center rounded-full border border-ink/12 px-4 text-[13px] font-semibold text-ink transition-all hover:border-brand hover:bg-brand hover:text-white"
          >
            {t("catalog.order")}
          </button>
        </div>
      </div>
    </article>
  );
}
