// Per-instance i18n factory. Each [lang] layout creates its own instance
// synchronously (initImmediate: false) so client components render the right
// language on the server too — no flash, no hydration mismatch. The public
// instance carries "translation"; the admin panel carries "admin".

"use client";

import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import uz from "./resources/uz.json";
import ru from "./resources/ru.json";
import en from "./resources/en.json";
import adminUz from "./resources/admin-uz.json";
import adminRu from "./resources/admin-ru.json";
import adminEn from "./resources/admin-en.json";
import type { Lang } from "../types";

type InitOptionsWithSync = import("i18next").InitOptions & { initImmediate: boolean };

export function createI18n(lang: Lang, namespace: "translation" | "admin" = "translation") {
  const instance = i18next.createInstance();
  instance.use(initReactI18next).init({
    resources: {
      uz: { translation: uz, admin: adminUz },
      ru: { translation: ru, admin: adminRu },
      en: { translation: en, admin: adminEn }
    },
    lng: lang,
    fallbackLng: "uz",
    supportedLngs: ["uz", "ru", "en"],
    defaultNS: namespace,
    interpolation: { escapeValue: false },
    initImmediate: false,
    react: { useSuspense: false }
  } as InitOptionsWithSync);
  return instance;
}
