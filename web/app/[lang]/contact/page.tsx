// Contact page: contact details + form. The locations page holds the big map.

import type { Metadata } from "next";
import { ContactClient } from "@/components/contact/ContactClient";
import { fetchSettingsServer } from "@/lib/api";
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
    pathname: `/${lang}/contact`,
    title: t("seo.contact.title"),
    description: t("seo.contact.description")
  });
}

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const settings = await fetchSettingsServer();
  return <ContactClient lang={lang as Lang} settings={settings} />;
}
