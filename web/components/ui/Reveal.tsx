// Scroll-reveal wrapper: IntersectionObserver flips a class once the element
// enters the viewport. Pure CSS transitions do the rest, so there is zero
// scroll-jank and the reveal stays visible if JS fails for any reason.

"use client";

import { useReveal } from "@/lib/hooks";
import { cn } from "@/lib/utils";

export function Reveal({
  children,
  className,
  delay = 0,
  from = "up",
  as: Tag = "div"
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  from?: "up" | "left" | "right" | "none";
  as?: "div" | "section" | "li" | "span";
}) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const hidden =
    from === "up" ? "translate-y-8" : from === "left" ? "-translate-x-8" : from === "right" ? "translate-x-8" : "";
  return (
    <Tag
      ref={ref as never}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform",
        visible ? "translate-x-0 translate-y-0 opacity-100" : cn("opacity-0", hidden),
        className
      )}
    >
      {children}
    </Tag>
  );
}
