// Language switcher: uz / ru / en. Supports a light variant for when the
// header sits over the dark hero. The active code gets the red pill and the
// route keeps its path when switching.

"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LANGS } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { cn } from "@/lib/utils";

export function LangSwitcher({ current, light = false }: { current: Lang; light?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();

  const switchTo = (lang: Lang) => {
    if (lang === current) return;
    const path = pathname.replace(new RegExp(`^/(${LANGS.join("|")})`), "") || "/";
    router.push(`/${lang}${path}`);
  };

  return (
    <div
      className={cn(
        "flex items-center rounded-full border p-0.5 backdrop-blur",
        light ? "border-white/25 bg-white/10" : "border-ink/10 bg-white/70"
      )}
      role="group"
      aria-label="Language"
    >
      {LANGS.map((lang) => (
        <button
          key={lang}
          onClick={() => switchTo(lang)}
          aria-pressed={lang === current}
          className={cn(
            "relative rounded-full px-2.5 py-1 text-[12px] font-bold uppercase tracking-wide transition-colors",
            lang === current ? "text-white" : light ? "text-white/70 hover:text-white" : "text-ink/55 hover:text-ink"
          )}
        >
          {lang === current && (
            <motion.span
              layoutId="lang-pill"
              className="absolute inset-0 rounded-full bg-brand"
              transition={{ type: "spring", stiffness: 500, damping: 36 }}
            />
          )}
          <span className="relative">{lang}</span>
        </button>
      ))}
    </div>
  );
}
