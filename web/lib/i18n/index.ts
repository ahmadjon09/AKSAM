// i18n constants. Instances are created per-locale via createInstance.ts;
// this module only holds the shared language metadata.

import type { Lang } from "../types";

export const LANGS: Lang[] = ["uz", "ru", "en"];

export const LANG_LABELS: Record<Lang, string> = {
  uz: "O'zbekcha",
  ru: "Русский",
  en: "English"
};
