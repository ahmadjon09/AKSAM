// Every button in the project uses this component, so loading states,
// disabled states and icon sizing stay consistent everywhere.

"use client";

import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "./Spinner";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "dark" | "outline" | "ghost" | "light";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", loading = false, icon, fullWidth, className, children, disabled, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 font-semibold tracking-wide transition-all duration-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand",
        "disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none",
        size === "sm" && "text-[13px] px-4 h-9",
        size === "md" && "text-sm px-6 h-11",
        size === "lg" && "text-[15px] px-8 h-[52px]",
        variant === "primary" && "bg-brand text-white hover:bg-brand-dark shadow-[0_10px_30px_-12px_rgba(200,16,46,0.55)] hover:shadow-[0_14px_36px_-12px_rgba(200,16,46,0.65)] hover:-translate-y-px",
        variant === "dark" && "bg-ink text-white hover:bg-black hover:-translate-y-px",
        variant === "outline" && "border border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-white",
        variant === "ghost" && "text-ink hover:bg-ink/5",
        variant === "light" && "bg-white text-ink hover:bg-paper border border-white/10",
        fullWidth && "w-full",
        className
      )}
      {...rest}
    >
      {loading ? (
        <Spinner size="sm" tone={variant === "outline" || variant === "ghost" ? "dark" : "light"} />
      ) : (
        icon
      )}
      <span className={cn(loading && "opacity-80")}>{children}</span>
    </button>
  );
});
