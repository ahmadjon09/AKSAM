// The interactive catalog: category filter chips, live search, sorting and
// result count. Search uses a short debounce so typing never janks. The
// category is kept in the URL query so links from the home page land
// pre-filtered, and empty states guide the visitor back to the full list.

"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ProductCard } from "@/components/catalog/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { useDebouncedValue } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import type { CategoryDto, Lang, ProductDto } from "@/lib/types";

export function CatalogClient({
  lang,
  products,
  categories,
  initialCategory
}: {
  lang: Lang;
  products: ProductDto[];
  categories: CategoryDto[];
  initialCategory: string;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 180);

  const activeCategory = searchParams.get("category") ?? initialCategory;

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return products.filter((p) => {
      if (activeCategory !== "all" && p.category?.slug !== activeCategory) return false;
      if (!q) return true;
      const haystack = [p.name.uz, p.name.ru, p.name.en, p.short.uz, p.short.ru, p.short.en]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [products, activeCategory, debouncedQuery]);

  const setCategory = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === "all") params.delete("category");
    else params.set("category", slug);
    const qs = params.toString();
    router.replace(qs ? `/${lang}/products?${qs}` : `/${lang}/products`, { scroll: false });
  };

  const clearAll = () => {
    setQuery("");
    setCategory("all");
  };

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-ink/8 pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t("catalog.filters")}>
          <button
            onClick={() => setCategory("all")}
            className={cn(
              "h-10 rounded-full border px-5 text-[13.5px] font-semibold transition-all",
              activeCategory === "all"
                ? "border-ink bg-ink text-white"
                : "border-ink/15 bg-white text-ink/70 hover:border-ink/40 hover:text-ink"
            )}
          >
            {t("common.all")}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.slug)}
              className={cn(
                "h-10 rounded-full border px-5 text-[13.5px] font-semibold transition-all",
                activeCategory === cat.slug
                  ? "border-brand bg-brand text-white"
                  : "border-ink/15 bg-white text-ink/70 hover:border-brand/50 hover:text-brand"
              )}
            >
              {cat.name[lang] || cat.name.uz}
            </button>
          ))}
        </div>

        <div className="relative lg:w-72">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink/35" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("catalog.searchPlaceholder")}
            className="h-11 w-full rounded-full border border-ink/12 bg-white pl-10 pr-10 text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-ink"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label={t("common.close")}
              className="absolute right-3 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full text-ink/40 hover:bg-ink/5 hover:text-ink"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 flex items-center gap-3 text-sm text-ink/50">
        <SlidersHorizontal className="size-4 text-brand" />
        <span>
          <strong className="font-semibold text-ink">{filtered.length}</strong> {t("common.results")}
        </span>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 min-[1700px]:grid-cols-4 lg:gap-x-8 lg:gap-y-14">
          {filtered.map((product, i) => (
            <Reveal key={product.id} delay={(i % 3) * 70}>
              <ProductCard product={product} lang={lang} />
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-ink/15 bg-paper px-6 py-20 text-center">
          <Search className="size-8 text-ink/25" />
          <p className="max-w-sm text-[15px] text-ink/60">{t("catalog.empty")}</p>
          <button
            onClick={clearAll}
            className="mt-1 inline-flex h-10 items-center rounded-full border border-ink/15 px-5 text-sm font-semibold text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
          >
            {t("catalog.clearFilters")}
          </button>
        </div>
      )}
    </div>
  );
}
