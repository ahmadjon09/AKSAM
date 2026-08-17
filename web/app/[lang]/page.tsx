// Home page: hero, marquee strip, product lines, featured products, brand
// story, process, quality pillars, testimonials and the closing CTA.

export const dynamic = "error";
import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/ui/Marquee";
import { Categories } from "@/components/home/Categories";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Story } from "@/components/home/Story";
import { Process } from "@/components/home/Process";
import { Craft } from "@/components/home/Craft";
import { GallerySection } from "@/components/home/GallerySection";
import { FaqSection } from "@/components/home/FaqSection";
import { Testimonials } from "@/components/home/Testimonials";
import { CtaSection } from "@/components/home/CtaSection";
import { fetchCategoriesServer, fetchProductsServer, fetchSettingsServer } from "@/lib/api";
import { buildPageMetadata, organizationJsonLd } from "@/lib/seo";
import { getServerT } from "@/lib/i18n/server";
import type { Lang } from "@/lib/types";


export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const t = getServerT(lang as Lang);
  return buildPageMetadata({
    lang: lang as Lang,
    pathname: `/${lang}`,
    title: t("seo.home.title"),
    description: t("seo.home.description"),
    ogImage: "/images/og-default.jpg"
  });
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const [products, categories, settings] = await Promise.all([
    fetchProductsServer(),
    fetchCategoriesServer(),
    fetchSettingsServer()
  ]);

  return (
    <>
      <Hero lang={lang as Lang} />
      <Marquee lang={lang as Lang} />
      <Categories lang={lang as Lang} categories={categories} products={products} />
      <FeaturedProducts lang={lang as Lang} products={products} />
      <Story lang={lang as Lang} />
      <Process lang={lang as Lang} />
      <Craft lang={lang as Lang} />
      <GallerySection lang={lang as Lang} />
      <Testimonials lang={lang as Lang} />
      <FaqSection lang={lang as Lang} />
      <CtaSection settings={settings} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd(settings)) }}
      />
    </>
  );
}
