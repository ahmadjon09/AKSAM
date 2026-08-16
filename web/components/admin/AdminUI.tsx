// Small shared pieces for the panel: page heading, stat card, mini SVG bar
// chart, confirm dialog and status pill. Deliberately lightweight — the
// panel should feel fast, not heavy.

"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CircleAlert, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";

export function PageHeading({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink/50">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({ label, value, icon, hint }: { label: string; value: string; icon?: React.ReactNode; hint?: string }) {
  return (
    <div className="rounded-xl border border-ink/8 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-ink/45">{label}</p>
        {icon && <span className="grid size-8 place-items-center rounded-lg bg-brand/8 text-brand">{icon}</span>}
      </div>
      <p className="mt-2 text-3xl font-extrabold tracking-tight text-ink">{value}</p>
      {hint && <p className="mt-1 text-[12px] text-ink/40">{hint}</p>}
    </div>
  );
}

export function MiniBars({
  series,
  height = 160,
  color = "#c8102e",
  format = (v: number) => String(v)
}: {
  series: { label: string; value: number }[];
  height?: number;
  color?: string;
  format?: (v: number) => string;
}) {
  const max = Math.max(1, ...series.map((s) => s.value));
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex items-end gap-[3px] sm:gap-1.5" style={{ height }} aria-hidden>
      {series.map((s, i) => (
        <div key={i} className="group relative flex h-full flex-1 flex-col justify-end">
          <div
            className="w-full rounded-t-[3px] transition-all duration-700 ease-out"
            style={{
              height: visible ? `${Math.max(2, (s.value / max) * 100)}%` : "0%",
              background: color,
              opacity: 0.12 + 0.88 * (s.value / max),
              transitionDelay: `${i * 24}ms`
            }}
            title={`${s.label}: ${format(s.value)}`}
          />
        </div>
      ))}
    </div>
  );
}

export function ConfirmModal({
  open,
  title,
  text,
  onConfirm,
  onClose,
  loading = false
}: {
  open: boolean;
  title: string;
  text: string;
  onConfirm: () => void;
  onClose: () => void;
  loading?: boolean;
}) {
  const { t } = useTranslation();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl">
        <span className="grid size-11 place-items-center rounded-full bg-brand/10 text-brand">
          <CircleAlert className="size-5" />
        </span>
        <h3 className="mt-4 text-lg font-bold tracking-tight text-ink">{title}</h3>
        <p className="mt-1.5 text-sm text-ink/55">{text}</p>
        <div className="mt-6 flex gap-3">
          <Button variant="outline" onClick={onClose} fullWidth>
            {t("common.no")}
          </Button>
          <Button onClick={onConfirm} loading={loading} fullWidth>
            {t("common.yes")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function StatusPill({ status, t }: { status: string; t: (key: string) => string }) {
  const styles: Record<string, string> = {
    NEW: "bg-brand/10 text-brand",
    CONTACTED: "bg-amber-100 text-amber-700",
    CLOSED: "bg-emerald-100 text-emerald-700",
    SPAM: "bg-neutral-200 text-neutral-500"
  };
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[11.5px] font-bold", styles[status] ?? "bg-neutral-100 text-neutral-500")}>
      {t(`leads.statusNames.${status}`)}
    </span>
  );
}

export function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-ink/15 bg-white px-6 py-16 text-center">
      <span className="text-ink/25">{icon}</span>
      <p className="max-w-xs text-sm text-ink/50">{text}</p>
    </div>
  );
}

export function DeleteButton({ onClick, loading, label }: { onClick: () => void; loading?: boolean; label: string }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      aria-label={label}
      className="grid size-9 place-items-center rounded-lg border border-ink/10 text-ink/45 transition-colors hover:border-brand/40 hover:text-brand disabled:opacity-50"
    >
      {loading ? <Spinner size="sm" tone="dark" /> : <Trash2 className="size-4" />}
    </button>
  );
}
