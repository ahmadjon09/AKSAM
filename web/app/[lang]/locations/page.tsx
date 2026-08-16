// Locations page: the production address on an interactive map, delivery
// regions and directions. Leaflet loads only on this page.

import type { Metadata } from "next";
import { LocationsClient } from "@/components/map/LocationsClient";
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
    pathname: `/${lang}/locations`,
    title: t("seo.locations.title"),
    description: t("seo.locations.description")
  });
}

export default async function LocationsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const settings = await fetchSettingsServer();
  return <LocationsClient lang={lang as Lang} settings={settings} />;
}
