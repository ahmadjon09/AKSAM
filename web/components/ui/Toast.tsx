// Toast notifications. All async actions across the site (forms, admin CRUD)
// report their outcome here, with a fully translated title and description.

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, CircleAlert, Info, X } from "lucide-react";
import { useUiStore } from "@/lib/store/ui";
import { cn } from "@/lib/utils";

export function ToastHost() {
  const toasts = useUiStore((s) => s.toasts);
  const dismiss = useUiStore((s) => s.dismissToast);

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[90] flex w-[min(94vw,380px)] flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = toast.kind === "success" ? Check : toast.kind === "error" ? CircleAlert : Info;
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
              className={cn(
                "pointer-events-auto relative flex items-start gap-3 rounded-xl border p-4 pr-10 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.35)] backdrop-blur",
                toast.kind === "success" && "border-emerald-200 bg-white text-ink",
                toast.kind === "error" && "border-brand/25 bg-white text-ink",
                toast.kind === "info" && "border-ink/10 bg-ink text-white"
              )}
            >
              <span
                className={cn(
                  "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full",
                  toast.kind === "success" && "bg-emerald-100 text-emerald-700",
                  toast.kind === "error" && "bg-brand/10 text-brand",
                  toast.kind === "info" && "bg-white/15 text-white"
                )}
              >
                <Icon className="size-3.5" strokeWidth={2.4} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-tight">{toast.title}</p>
                {toast.description && (
                  <p className={cn("mt-1 text-[13px] leading-snug", toast.kind === "info" ? "text-white/70" : "text-ink/60")}>
                    {toast.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => dismiss(toast.id)}
                aria-label="Close notification"
                className={cn(
                  "absolute right-3 top-3 grid size-6 place-items-center rounded-md transition-colors",
                  toast.kind === "info" ? "text-white/60 hover:bg-white/10 hover:text-white" : "text-ink/40 hover:bg-ink/5 hover:text-ink"
                )}
              >
                <X className="size-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
