// The single spinner used everywhere. Rendered inside buttons, forms and
// skeletons so loading feedback looks identical across the whole product.

"use client";

import { cn } from "@/lib/utils";

export function Spinner({ size = "md", tone = "light", className }: { size?: "sm" | "md" | "lg"; tone?: "light" | "dark"; className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-current border-t-transparent",
        size === "sm" && "size-4",
        size === "md" && "size-5",
        size === "lg" && "size-7",
        tone === "light" ? "text-white/90" : "text-ink/70",
        className
      )}
    />
  );
}
