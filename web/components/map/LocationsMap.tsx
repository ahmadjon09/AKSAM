// Locations map on Google Maps. Uses the keyless embed endpoint by default
// (no API key needed); set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to switch to the
// official Embed API. A white info card with the address and an "open in
// Google Maps" link floats over the map.

"use client";

import { ExternalLink, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Lang } from "@/lib/types";

export function LocationsMap({
  lat,
  lng,
  label,
  lang
}: {
  lat: number;
  lng: number;
  label: string;
  lang: Lang;
}) {
  const { t } = useTranslation();
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Keyless embed works without a Google account; with a key we get the
  // official Embed API with nicer rendering.
  const embedSrc = apiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${lat},${lng}&language=${lang}&zoom=16`
    : `https://www.google.com/maps?q=${lat},${lng}&z=16&hl=${lang}&output=embed`;

  const openSrc = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  return (
    <div className="relative overflow-hidden rounded-2xl ring-1 ring-ink/10">
      <iframe
        src={embedSrc}
        title={label}
        className="h-[420px] w-full border-0 sm:h-[500px]"
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="pointer-events-none absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6">
        <div className="pointer-events-auto max-w-sm rounded-xl bg-white/95 p-5 shadow-[0_20px_60px_-24px_rgba(0,0,0,0.45)] ring-1 ring-ink/5 backdrop-blur">
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
            <MapPin className="size-3.5" />
            AKSAM
          </span>
          <p className="mt-2 text-[14px] font-semibold leading-snug text-ink">{label}</p>
          <a
            href={openSrc}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3.5 inline-flex h-10 items-center gap-2 rounded-full bg-brand px-5 text-[13px] font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            {t("locations.openInMaps")}
            <ExternalLink className="size-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
