// Form field primitives with consistent labels, hints and error states.
// Error text is announced for screen readers via aria-describedby.

"use client";

import { forwardRef, useId } from "react";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface FieldWrapProps {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  htmlFor?: string;
}

export function FieldWrap({ label, hint, error, required, children, htmlFor }: FieldWrapProps) {
  const errorId = useId();
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={htmlFor} className="block text-[13px] font-semibold tracking-wide text-ink">
          {label}
          {required && <span className="ml-0.5 text-brand">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p id={errorId} className="flex items-center gap-1.5 text-[12.5px] font-medium text-brand">
          <CircleAlert className="size-3.5 shrink-0" />
          {error}
        </p>
      ) : hint ? (
        <p className="text-[12.5px] text-ink/50">{hint}</p>
      ) : null}
    </div>
  );
}

export const TextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }>(
  function TextInput({ className, invalid, ...rest }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          "h-11 w-full rounded-lg border bg-white px-3.5 text-[15px] text-ink outline-none transition-all",
          "placeholder:text-ink/35 focus:ring-2",
          invalid
            ? "border-brand/60 focus:border-brand focus:ring-brand/15"
            : "border-ink/15 hover:border-ink/30 focus:border-ink focus:ring-ink/10",
          className
        )}
        {...rest}
      />
    );
  }
);

export const TextArea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }>(
  function TextArea({ className, invalid, ...rest }, ref) {
    return (
      <textarea
        ref={ref}
        className={cn(
          "min-h-[96px] w-full resize-y rounded-lg border bg-white px-3.5 py-3 text-[15px] text-ink outline-none transition-all",
          "placeholder:text-ink/35 focus:ring-2",
          invalid
            ? "border-brand/60 focus:border-brand focus:ring-brand/15"
            : "border-ink/15 hover:border-ink/30 focus:border-ink focus:ring-ink/10",
          className
        )}
        {...rest}
      />
    );
  }
);
