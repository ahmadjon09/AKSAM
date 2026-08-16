// Product detail page. Metadata is built per product per locale — including
// the OG image taken from the product's own gallery (never a generic banner)
// — and JSON-LD Product structured data is emitted without any price field.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductClient } from "@/components/product/ProductClient";
import { fetchProductsServer } from "@/lib/api";
import { buildPageMetadata, productJsonLd, pickText } from "@/lib/seo";
import { getServerT } from "@/lib/i18n/server";
import type { Lang } from "@/lib/types";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const products = await fetchProductsServer();
  const product = products.find((p) => p.slug === slug);
  if (!product) {
    const t = getServerT(lang as Lang);
    return buildPageMetadata({
      lang: lang as Lang,
      pathname: `/${lang}/products/${slug}`,
      title: t("seo.default.title"),
      description: t("seo.default.description")
    });
  }

  const name = pickText(product.name, lang as Lang);
  const metaTitle = pickText(product.metaTitle, lang as Lang) || name;
  const metaDesc = pickText(product.metaDesc, lang as Lang) || pickText(product.short, lang as Lang);

  return buildPageMetadata({
    lang: lang as Lang,
    pathname: `/${lang}/products/${slug}`,
    title: metaTitle,
    description: metaDesc,
    ogImage: product.images[0]
  });
}

export default async function ProductPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const products = await fetchProductsServer();
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  const related = products
    .filter((p) => p.slug !== slug && p.category?.slug === product.category?.slug)
    .slice(0, 4);

  return (
    <div className="pt-28 sm:pt-32">
      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 sm:pb-28 lg:px-8">
        <ProductClient product={product} related={related} lang={lang as Lang} />
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product, lang as Lang)) }}
      />
    </div>
  );
}
