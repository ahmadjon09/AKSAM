// Contact page: info cards on the left (phone / email / address / hours),
// form on the right. All values come from admin-managed settings.

"use client";

import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ContactForm } from "@/components/contact/ContactForm";
import { Reveal } from "@/components/ui/Reveal";
import { pickText } from "@/lib/seo";
import type { Lang, PublicSettingsDto } from "@/lib/types";

export function ContactClient({ lang, settings }: { lang: Lang; settings: PublicSettingsDto }) {
  const { t } = useTranslation();
  const phoneHref = `tel:${settings.phone.replace(/[^\d+]/g, "")}`;

  const cards = [
    {
      icon: Phone,
      label: t("contact.phoneLabel"),
      value: settings.phone,
      href: phoneHref,
      note: t("contact.phoneNote")
    },
    {
      icon: Mail,
      label: t("contact.emailLabel"),
      value: settings.email,
      href: `mailto:${settings.email}`,
      note: t("contact.emailNote")
    },
    {
      icon: MapPin,
      label: t("contact.addressLabel"),
      value: pickText(settings.address, lang),
      href: null,
      note: ""
    },
    {
      icon: Clock,
      label: t("contact.hoursLabel"),
      value: pickText(settings.workHours, lang),
      href: null,
      note: ""
    }
  ];

  return (
    <div className="pt-28 sm:pt-36">
      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 sm:pb-28 lg:px-8">
        <Reveal className="max-w-2xl">
          <span className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.22em] text-brand">
            <span className="h-px w-8 bg-brand/50" />
            AKSAM
          </span>
          <h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl">
            {t("contact.title")}
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink/55 sm:text-base">{t("contact.subtitle")}</p>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <Reveal from="left">
            <div className="space-y-4">
              <h2 className="text-[13px] font-bold uppercase tracking-[0.18em] text-ink/50">
                {t("contact.infoTitle")}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {cards.map((card, i) => {
                  const Icon = card.icon;
                  const content = (
                    <>
                      <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-brand/8 text-brand">
                        <Icon className="size-5" strokeWidth={1.9} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[12.5px] font-bold uppercase tracking-[0.12em] text-ink/45">
                          {card.label}
                        </span>
                        <span className="mt-1 block break-words text-[15px] font-semibold text-ink">{card.value}</span>
                        {card.note && <span className="mt-0.5 block text-[12.5px] text-ink/45">{card.note}</span>}
                      </span>
                    </>
                  );
                  return (
                    <div
                      key={i}
                      className="flex items-start gap-3.5 rounded-xl border border-ink/8 bg-white p-5 transition-all duration-300 hover:border-brand/40"
                    >
                      {card.href ? (
                        <a href={card.href} className="flex w-full items-start gap-3.5">
                          {content}
                        </a>
                      ) : (
                        content
                      )}
                    </div>
                  );
                })}
              </div>
              {settings.telegram && (
                <a
                  href={settings.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl bg-ink p-5 text-white transition-all hover:bg-black"
                >
                  <span className="grid size-11 place-items-center rounded-lg bg-white/10">
                    <Send className="size-5" />
                  </span>
                  <span>
                    <span className="block text-[12.5px] font-bold uppercase tracking-[0.12em] text-white/50">
                      {t("contact.telegramLabel")}
                    </span>
                    <span className="mt-0.5 block text-[15px] font-semibold">@aksam_uz</span>
                  </span>
                </a>
              )}
            </div>
          </Reveal>

          <Reveal from="right" delay={100}>
            <ContactForm lang={lang} />
          </Reveal>
        </div>
      </div>
    </div>
  );
}
