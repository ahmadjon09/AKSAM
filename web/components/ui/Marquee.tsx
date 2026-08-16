// The red ribbon strip that separates the hero from the content. A single
// CSS animation scrolls the duplicated list; words are separated by a small
// diamond mark in white. Items come from the structured content module.

"use client";

import { Diamond } from "lucide-react";
import { localized, MARQUEE_ITEMS } from "@/lib/content";
import { cn } from "@/lib/utils";
import type { Lang } from "@/lib/types";

export function Marquee({ lang, className }: { lang: Lang; className?: string }) {
  const list = localized(MARQUEE_ITEMS, lang);
  const row = [...list, ...list];
  return (
    <div className={cn("relative overflow-hidden bg-brand py-3.5", className)} aria-hidden>
      <div className="flex w-max animate-marquee items-center gap-10 whitespace-nowrap will-change-transform">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-10 text-[13px] font-semibold uppercase tracking-[0.18em] text-white">
            {item}
            <Diamond className="size-2 fill-white/70 text-white/70" strokeWidth={0} />
          </span>
        ))}
      </div>
    </div>
  );
}
