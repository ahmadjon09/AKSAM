// Dashboard: visitor and lead totals, a 14-day bar chart and the latest
// leads. Numbers come from /v1/admin/stats which flushes live analytics
// before answering.

"use client";

import { useCallback, useEffect, useState } from "react";
import { Inbox, Package, TrendingUp, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { MiniBars, PageHeading, StatCard } from "@/components/admin/AdminUI";
import { adminApi } from "@/lib/api";
import { adminCall } from "@/lib/admin";
import { useUiStore } from "@/lib/store/ui";
import { formatDate, formatDayLabel } from "@/lib/utils";
import type { AdminStatsDto, LeadDto } from "@/lib/types";

export function DashboardView() {
  const { t } = useTranslation();
  const pushToast = useUiStore((s) => s.pushToast);
  const [stats, setStats] = useState<AdminStatsDto | null>(null);
  const [leads, setLeads] = useState<LeadDto[]>([]);

  const load = useCallback(async () => {
    try {
      const [statsRes, leadsRes] = await Promise.all([
        adminCall((token) => adminApi.getStats(token)),
        adminCall((token) => adminApi.listLeads(token, "?page=1"))
      ]);
      setStats(statsRes.data);
      setLeads(leadsRes.data.slice(0, 6));
    } catch {
      pushToast({ kind: "error", title: t("errors.generic") });
    }
  }, [pushToast, t]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!stats) {
    return (
      <div className="space-y-5">
        <div className="h-8 w-56 animate-pulse rounded bg-neutral-200" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-neutral-200" />
          ))}
        </div>
      </div>
    );
  }

  const viewsSeries = stats.series.map((s) => ({ label: formatDayLabel(s.day, "ru"), value: s.views }));
  const leadsSeries = stats.leadsSeries.map((s) => ({ label: formatDayLabel(s.day, "ru"), value: s.count }));

  return (
    <div>
      <PageHeading title={t("dashboard.title")} subtitle={t("dashboard.subtitle")} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label={t("dashboard.visitorsToday")} value={String(stats.visitorsToday)} icon={<TrendingUp className="size-4" />} />
        <StatCard label={t("dashboard.uniqueToday")} value={String(stats.uniqueToday)} icon={<Users className="size-4" />} />
        <StatCard label={t("dashboard.views30d")} value={String(stats.views30d)} hint={`${t("dashboard.unique30d")}: ${stats.unique30d}`} />
        <StatCard label={t("dashboard.newLeads")} value={String(stats.newLeads)} icon={<Inbox className="size-4" />} hint={`${t("dashboard.productsActive")}: ${stats.productsActive}/${stats.productsTotal}`} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-ink/8 bg-white p-6">
          <h2 className="text-sm font-bold text-ink">{t("dashboard.viewsChart")}</h2>
          <p className="mb-5 mt-0.5 text-[12px] text-ink/45">{t("dashboard.last14d")}</p>
          <MiniBars series={viewsSeries} />
        </div>
        <div className="rounded-xl border border-ink/8 bg-white p-6">
          <h2 className="text-sm font-bold text-ink">{t("dashboard.leadsChart")}</h2>
          <p className="mb-5 mt-0.5 text-[12px] text-ink/45">{t("dashboard.last14d")}</p>
          <MiniBars series={leadsSeries} />
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-ink/8 bg-white">
        <div className="flex items-center justify-between border-b border-ink/8 px-6 py-4">
          <h2 className="text-sm font-bold text-ink">{t("dashboard.recentLeads")}</h2>
        </div>
        {leads.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-ink/45">{t("dashboard.emptyLeads")}</p>
        ) : (
          <ul className="divide-y divide-ink/6">
            {leads.map((lead) => (
              <li key={lead.id} className="flex items-center justify-between gap-4 px-6 py-3.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{lead.fullName}</p>
                  <p className="truncate text-[12.5px] text-ink/45">
                    {lead.phone}
                    {lead.productName ? ` · ${lead.productName}` : ""}
                  </p>
                </div>
                <span className="shrink-0 text-[12px] text-ink/40">{formatDate(lead.createdAt, "ru")}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
