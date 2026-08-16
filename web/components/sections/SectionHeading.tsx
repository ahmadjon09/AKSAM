// Consistent section header: red eyebrow, big title and muted subtitle,
// aligned left or centred, with a scroll reveal.

"use client";

import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  light = false
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
}) {
  return (
    <Reveal className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      <span className={cn("inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.22em]", light ? "text-white/60" : "text-brand")}>
        <span className={cn("h-px w-8", light ? "bg-white/40" : "bg-brand/50")} />
        {eyebrow}
        {align === "center" && <span className={cn("h-px w-8", light ? "bg-white/40" : "bg-brand/50")} />}
      </span>
      <h2 className={cn("mt-4 text-3xl font-bold leading-[1.08] tracking-tight sm:text-4xl lg:text-[44px]", light ? "text-white" : "text-ink")}>
        {title}
      </h2>
      {subtitle && <p className={cn("mt-4 text-[15px] leading-relaxed sm:text-base", light ? "text-white/60" : "text-ink/55")}>{subtitle}</p>}
    </Reveal>
  );
}
