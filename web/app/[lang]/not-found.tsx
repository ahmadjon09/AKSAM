// Localized 404. Doubles as a client-side lookup for products created in
// the admin after the last build: if the path is /products/<slug> and the
// slug exists in the freshly hydrated catalog, the product page renders
// here instead of an error.

"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Home } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ProductClient } from "@/components/product/ProductClient";
import { useDataStore } from "@/lib/data/store";
import { LANGS } from "@/lib/i18n";
import type { Lang } from "@/lib/types";

export default function NotFound() {
  const { t } = useTranslation();
  const params = useParams<{ lang?: string }>();
  const pathname = usePathname();
  const lang = (LANGS.includes(params?.lang as Lang) ? params?.lang : "uz") as Lang;

  const hydratedProducts = useDataStore((s) => s.products);
  const slugMatch = pathname.match(new RegExp(`^/(${LANGS.join("|")})/products/([a-z0-9-]+)$`));
  if (slugMatch && hydratedProducts) {
    const found = hydratedProducts.find((p) => p.slug === slugMatch[2]);
    if (found) {
      return (
        <div className="pt-28 sm:pt-32">
          <div className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-28 lg:px-12">
            <ProductClient product={found} related={[]} lang={lang} />
          </div>
        </div>
      );
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 pt-24">
      <div className="text-center">
        <p className="text-8xl font-extrabold leading-none tracking-tight text-brand">404</p>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-ink sm:text-3xl">{t("notFound.title")}</h1>
        <p className="mx-auto mt-3 max-w-sm text-[15px] text-ink/55">{t("notFound.text")}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={`/${lang}`}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            <Home className="size-4" />
            {t("notFound.button")}
          </Link>
          <Link
            href={`/${lang}/products`}
            className="inline-flex h-11 items-center rounded-full border border-ink/15 px-6 text-sm font-semibold text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
          >
            {t("nav.products")}
          </Link>
        </div>
      </div>
    </div>
  );
}
