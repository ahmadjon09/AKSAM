// Server-side i18n helper. Used for metadata, JSON-LD and any static text
// rendered inside server components, so SEO output is translated too.

import i18next from "i18next";
import uz from "./resources/uz.json";
import ru from "./resources/ru.json";
import en from "./resources/en.json";
import type { Lang } from "../types";

let ready = false;

function init() {
  if (ready) return;
  i18next.init({
    resources: {
      uz: { translation: uz },
      ru: { translation: ru },
      en: { translation: en }
    },
    lng: "uz",
    fallbackLng: "uz",
    defaultNS: "translation",
    interpolation: { escapeValue: false }
  });
  ready = true;
}

export function getServerT(lang: Lang) {
  init();
  return i18next.getFixedT(lang, "translation");
}

export function pickLang<T>(localized: Record<Lang, T> | undefined, lang: Lang): T {
  if (!localized) return "" as T;
  return localized[lang] ?? localized.uz;
}
