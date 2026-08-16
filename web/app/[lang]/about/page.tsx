// About page. Story, values, team and the numbers band — all translated.

import type { Metadata } from "next";
import { AboutPageContent } from "@/components/about/AboutPageContent";
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
    pathname: `/${lang}/about`,
    title: t("seo.about.title"),
    description: t("seo.about.description")
  });
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <AboutPageContent lang={lang as Lang} />;
}
