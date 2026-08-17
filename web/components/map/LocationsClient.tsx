// Locations page: the factory address, the styled interactive map, delivery
// regions and directions.

"use client";

import { Car, MapPin, Phone, Send, Truck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LocationsMap } from "@/components/map/LocationsMap";
import { Reveal } from "@/components/ui/Reveal";
import { HOW_ITEMS, localized, REGIONS } from "@/lib/content";
import { useDataStore } from "@/lib/data/store";
import { pickText } from "@/lib/seo";
import type { Lang } from "@/lib/types";

export function LocationsClient({ lang }: { lang: Lang }) {
  const { t } = useTranslation();
  const settings = useDataStore((s) => s.settings);
  const regions = localized(REGIONS, lang);
  const howItems = localized(HOW_ITEMS, lang);
  const howIcons = [Car, Phone, Send];
  const mapUrl = `https://maps.google.com/?q=${settings.mapLat},${settings.mapLng}`;

  return (
    <div className="pt-28 sm:pt-36">
      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 sm:pb-28 lg:px-8">
        <Reveal className="max-w-2xl">
          <span className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.22em] text-brand">
            <span className="h-px w-8 bg-brand/50" />
            AKSAM
          </span>
          <h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl">
            {t("locations.title")}
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink/55 sm:text-base">{t("locations.subtitle")}</p>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:gap-10">
          <Reveal from="left" className="space-y-5">
            <div className="rounded-2xl border border-ink/8 bg-white p-7">
              <span className="grid size-11 place-items-center rounded-lg bg-brand/8 text-brand">
                <MapPin className="size-5" strokeWidth={1.9} />
              </span>
              <h2 className="mt-4 text-lg font-bold tracking-tight text-ink">{t("locations.addressTitle")}</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-ink/65">{pickText(settings.address, lang)}</p>
              <p className="mt-3 text-[13px] text-ink/45">{t("locations.addressNote")}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center rounded-full bg-brand px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
                >
                  {t("contact.mapTitle")}
                </a>
                <a
                  href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-ink/15 px-5 text-sm font-semibold text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
                >
                  <Phone className="size-3.5" />
                  {settings.phone}
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-ink/8 bg-white p-7">
              <span className="grid size-11 place-items-center rounded-lg bg-brand/8 text-brand">
                <Truck className="size-5" strokeWidth={1.9} />
              </span>
              <h2 className="mt-4 text-lg font-bold tracking-tight text-ink">{t("locations.deliveryTitle")}</h2>
              <p className="mt-2 text-[14px] leading-relaxed text-ink/60">{t("locations.deliveryText")}</p>
              <p className="mt-4 text-[12.5px] font-bold uppercase tracking-[0.14em] text-ink/45">
                {t("locations.regionsTitle")}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {regions.map((region) => (
                  <span key={region} className="rounded-full bg-paper px-3.5 py-1.5 text-[13px] font-medium text-ink/70">
                    {region}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal from="right" delay={100}>
            <LocationsMap lat={settings.mapLat} lng={settings.mapLng} label={pickText(settings.mapLabel, lang)} lang={lang} />
          </Reveal>
        </div>

        <Reveal className="mt-16">
          <h2 className="text-xl font-bold tracking-tight text-ink">{t("locations.howTitle")}</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {howItems.map((item, i) => {
              const Icon = howIcons[i % howIcons.length];
              return (
                <div key={i} className="rounded-xl border border-ink/8 bg-paper p-6">
                  <Icon className="size-5 text-brand" strokeWidth={1.9} />
                  <h3 className="mt-3 font-bold tracking-tight text-ink">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink/55">{item.text}</p>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
