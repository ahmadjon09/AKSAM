// Terms of Service page — localized, with full SEO alternates.

import type { Metadata } from "next";
import { TermsContent } from "@/components/terms/TermsContent";
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
    pathname: `/${lang}/terms`,
    title: t("seo.terms.title"),
    description: t("seo.terms.description")
  });
}

export default async function TermsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <TermsContent lang={lang as Lang} />;
}
