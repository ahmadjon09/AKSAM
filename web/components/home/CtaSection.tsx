// Closing call to action on the home page: dark panel with the phone number
// and a red CTA that opens the order modal.

"use client";

import { Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Reveal } from "@/components/ui/Reveal";
import { useUiStore } from "@/lib/store/ui";
import type { PublicSettingsDto } from "@/lib/types";

export function CtaSection({ settings }: { settings: PublicSettingsDto }) {
  const { t } = useTranslation();
  const openOrder = useUiStore((s) => s.openOrder);

  return (
    <section className="bg-paper pb-20 sm:pb-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl bg-ink px-8 py-16 text-center sm:px-16 sm:py-20">
            <span aria-hidden className="absolute left-1/2 top-0 h-[3px] w-40 -translate-x-1/2 bg-brand" />
            <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-24 size-72 rounded-full bg-brand/25 blur-[110px]" />
            <h2 className="mx-auto max-w-2xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
              {t("cta.title")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[15px] text-white/60">{t("cta.subtitle")}</p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
              <button
                onClick={() => openOrder()}
                className="h-13 rounded-full bg-brand px-8 text-[15px] font-semibold text-white shadow-[0_16px_44px_-14px_rgba(200,16,46,0.7)] transition-all hover:-translate-y-0.5 hover:bg-brand-dark"
              >
                {t("cta.button")}
              </button>
              <a
                href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`}
                className="inline-flex h-13 items-center gap-2.5 rounded-full border border-white/20 px-8 text-[15px] font-semibold text-white transition-all hover:border-white/50 hover:bg-white/10"
              >
                <Phone className="size-4" />
                {settings.phone}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
