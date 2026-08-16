// Visitors: range selector (14/30/90 days), totals and a bar chart of views
// and uniques per day.

"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MiniBars, PageHeading } from "@/components/admin/AdminUI";
import { adminApi } from "@/lib/api";
import { adminCall } from "@/lib/admin";
import { useUiStore } from "@/lib/store/ui";
import { cn, formatDayLabel } from "@/lib/utils";

interface Series {
  series: { day: string; views: number; uniques: number }[];
  totalViews: number;
  totalUniques: number;
}

export function VisitorsView() {
  const { t } = useTranslation();
  const pushToast = useUiStore((s) => s.pushToast);
  const [range, setRange] = useState(30);
  const [data, setData] = useState<Series | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(
    async (days: number) => {
      setLoading(true);
      try {
        const res = await adminCall((token) => adminApi.getVisitors(token, days));
        setData(res.data);
      } catch {
        pushToast({ kind: "error", title: t("errors.generic") });
      } finally {
        setLoading(false);
      }
    },
    [pushToast, t]
  );

  useEffect(() => {
    void load(range);
  }, [range, load]);

  return (
    <div>
      <PageHeading
        title={t("visitors.title")}
        subtitle={t("visitors.subtitle")}
        action={
          <div className="flex overflow-hidden rounded-full border border-ink/10 bg-white">
            {[14, 30, 90].map((days) => (
              <button
                key={days}
                onClick={() => setRange(days)}
                className={cn("px-4 py-2 text-[13px] font-semibold transition-colors", range === days ? "bg-ink text-white" : "text-ink/55 hover:text-ink")}
              >
                {days} {t("common.of")}
              </button>
            ))}
          </div>
        }
      />

      <div className="mb-6 flex flex-wrap gap-4">
        <div className="rounded-xl border border-ink/8 bg-white px-5 py-4">
          <p className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-ink/45">{t("visitors.totalViews")}</p>
          <p className="mt-1 text-2xl font-extrabold text-ink">{data?.totalViews ?? "—"}</p>
        </div>
        <div className="rounded-xl border border-ink/8 bg-white px-5 py-4">
          <p className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-ink/45">{t("visitors.totalUniques")}</p>
          <p className="mt-1 text-2xl font-extrabold text-ink">{data?.totalUniques ?? "—"}</p>
        </div>
      </div>

      <div className="rounded-xl border border-ink/8 bg-white p-6">
        {loading || !data ? (
          <div className="h-[220px] animate-pulse rounded bg-neutral-100" />
        ) : (
          <>
            <p className="mb-5 text-[12px] text-ink/45">
              {t("visitors.views")} · {range} {t("common.of")}
            </p>
            <MiniBars series={data.series.map((s) => ({ label: formatDayLabel(s.day, "ru"), value: s.views }))} height={200} />
            <div className="mt-6 border-t border-ink/6 pt-4">
              <p className="mb-4 text-[12px] text-ink/45">{t("visitors.uniques")}</p>
              <MiniBars
                series={data.series.map((s) => ({ label: formatDayLabel(s.day, "ru"), value: s.uniques }))}
                height={90}
                color="#1a1a1a"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
