// Locale layout: shared header/footer, providers, and per-request server
// data (settings). Public pages under [lang] are rendered dynamically on the
// edge and edge-cached by the middleware cache rules, so content added in
// the admin appears without a redeploy.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Providers } from "@/components/providers/Providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { fetchSettingsServer } from "@/lib/api";
import { LANGS, siteUrl } from "@/lib/seo";
import { getServerT } from "@/lib/i18n/server";
import type { Lang } from "@/lib/types";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!LANGS.includes(lang as Lang)) return {};
  const t = getServerT(lang as Lang);
  return {
    title: {
      default: t("seo.home.title"),
      template: "%s"
    },
    description: t("seo.home.description"),
    metadataBase: new URL(siteUrl())
  };
}

export default async function LangLayout({
  params,
  children
}: {
  params: Promise<{ lang: string }>;
  children: React.ReactNode;
}) {
  const { lang } = await params;
  if (!LANGS.includes(lang as Lang)) notFound();

  const settings = await fetchSettingsServer();

  return (
    <Providers lang={lang as Lang}>
      <Header lang={lang as Lang} phone={settings.phone} />
      <main className="min-h-screen">{children}</main>
      <Footer lang={lang as Lang} settings={settings} />
    </Providers>
  );
}
