// Contact page: contact details + form. The locations page holds the big map.

export const runtime = "edge";
export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { ContactClient } from "@/components/contact/ContactClient";
import { buildPageMetadata } from "@/lib/seo";
import { getServerT } from "@/lib/i18n/server";
import type { Lang } from "@/lib/types";


export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const t = getServerT(lang as Lang);
  return buildPageMetadata({
    lang: lang as Lang,
    pathname: `/${lang}/contact`,
    title: t("seo.contact.title"),
    description: t("seo.contact.description")
  });
}

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <ContactClient lang={lang as Lang} />;
}
