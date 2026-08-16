// Catalog page: filterable grid of all products. Interactive parts live in
// CatalogClient (client), data is fetched server-side per request and edge-
// cached. Suspense keeps useSearchParams happy under streaming.

import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogClient } from "@/components/catalog/CatalogClient";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { fetchCategoriesServer, fetchProductsServer } from "@/lib/api";
import { buildPageMetadata } from "@/lib/seo";
import { getServerT } from "@/lib/i18n/server";
import type { Lang } from "@/lib/types";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const t = getServerT(lang as Lang);
  return buildPageMetadata({
    lang: lang as Lang,
    pathname: `/${lang}/products`,
    title: t("seo.products.title"),
    description: t("seo.products.description")
  });
}

export default async function ProductsPage({
  params,
  searchParams
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { lang } = await params;
  const { category } = await searchParams;
  const t = getServerT(lang as Lang);
  const [products, categories] = await Promise.all([fetchProductsServer(), fetchCategoriesServer()]);
  const initialCategory = category ?? "all";

  return (
    <div className="pt-28 sm:pt-36">
      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 sm:pb-28 lg:px-8">
        <header className="max-w-2xl">
          <span className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.22em] text-brand">
            <span className="h-px w-8 bg-brand/50" />
            AKSAM
          </span>
          <h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl">
            {t("catalog.title")}
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink/55 sm:text-base">{t("catalog.subtitle")}</p>
        </header>

        <div className="mt-12">
          <Suspense fallback={<ProductGridSkeleton />}>
            <CatalogClient lang={lang as Lang} products={products} categories={categories} initialCategory={initialCategory} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
