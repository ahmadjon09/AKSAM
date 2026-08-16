// Leads: the order/contact messages mirrored from the Telegram flow.
// Filtering by status, quick status change, inline note editing, deletion
// for ADMIN+.

"use client";

import { useCallback, useEffect, useState } from "react";
import { Inbox, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ConfirmModal, DeleteButton, EmptyState, PageHeading, StatusPill } from "@/components/admin/AdminUI";
import { useAuthStore } from "@/lib/store/auth";
import { useUiStore } from "@/lib/store/ui";
import { adminApi } from "@/lib/api";
import { adminCall } from "@/lib/admin";
import { cn, formatDate } from "@/lib/utils";
import type { LeadDto } from "@/lib/types";

const STATUSES = ["", "NEW", "CONTACTED", "CLOSED", "SPAM"];

export function LeadsView() {
  const { t } = useTranslation();
  const pushToast = useUiStore((s) => s.pushToast);
  const user = useAuthStore((s) => s.user);
  const canDelete = user?.role === "SUPERADMIN" || user?.role === "ADMIN";

  const [leads, setLeads] = useState<LeadDto[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<LeadDto | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      if (status) params.set("status", status);
      if (query) params.set("q", query);
      const res = await adminCall((token) => adminApi.listLeads(token, `?${params.toString()}`));
      setLeads(res.data);
      setTotal((res as unknown as { total: number }).total ?? res.data.length);
    } catch {
      pushToast({ kind: "error", title: t("errors.generic") });
    } finally {
      setLoading(false);
    }
  }, [page, status, query, pushToast, t]);

  useEffect(() => {
    void load();
  }, [load]);

  const updateLead = async (id: string, patch: { status?: string; note?: string }) => {
    try {
      const res = await adminCall((token) => adminApi.updateLead(token, id, patch));
      setLeads((list) => list.map((l) => (l.id === id ? res.data : l)));
    } catch {
      pushToast({ kind: "error", title: t("errors.generic") });
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeleteLoading(true);
    try {
      await adminCall((token) => adminApi.deleteLead(token, deleting.id));
      setLeads((list) => list.filter((l) => l.id !== deleting.id));
      setDeleting(null);
    } catch {
      pushToast({ kind: "error", title: t("errors.generic") });
    } finally {
      setDeleteLoading(false);
    }
  };

  const pageSize = 25;
  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div>
      <PageHeading title={t("leads.title")} subtitle={t("leads.subtitle")} />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:w-56">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink/35" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder={t("common.search")}
            className="h-10 w-full rounded-lg border border-ink/10 bg-white pl-9 pr-3 text-sm outline-none focus:border-ink"
          />
        </div>
        <div className="flex overflow-hidden rounded-lg border border-ink/10 bg-white">
          {STATUSES.map((s) => (
            <button
              key={s || "all"}
              onClick={() => {
                setStatus(s);
                setPage(1);
              }}
              className={cn("px-3.5 py-2 text-[12.5px] font-semibold transition-colors", status === s ? "bg-ink text-white" : "text-ink/55 hover:text-ink")}
            >
              {s === "" ? t("common.all") : t(`leads.statusNames.${s}`)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-neutral-200" />
          ))}
        </div>
      ) : leads.length === 0 ? (
        <EmptyState icon={<Inbox className="size-8" />} text={t("leads.empty")} />
      ) : (
        <div className="overflow-hidden rounded-xl border border-ink/8 bg-white">
          <ul className="divide-y divide-ink/6">
            {leads.map((lead) => (
              <li key={lead.id} className="px-4 py-4 sm:px-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <p className="text-[15px] font-bold text-ink">{lead.fullName}</p>
                      <StatusPill status={lead.status} t={t} />
                      <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-bold text-ink/50">
                        {t(`leads.sourceNames.${lead.source}`)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-ink/60">
                      <a href={`tel:${lead.phone}`} className="font-semibold text-ink hover:text-brand">
                        {lead.phone}
                      </a>
                      {lead.productName && <span> · {lead.productName}</span>}
                      {lead.lang && <span className="text-ink/35"> · {lead.lang}</span>}
                    </p>
                    {lead.message && <p className="mt-1.5 max-w-2xl text-[13.5px] leading-relaxed text-ink/55">{lead.message}</p>}
                    <p className="mt-1 text-[12px] text-ink/35">{formatDate(lead.createdAt, "ru")}</p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <select
                      value={lead.status}
                      onChange={(e) => void updateLead(lead.id, { status: e.target.value })}
                      className="h-9 rounded-lg border border-ink/12 bg-white px-2.5 text-[13px] font-semibold text-ink outline-none focus:border-ink"
                    >
                      {STATUSES.slice(1).map((s) => (
                        <option key={s} value={s}>
                          {t(`leads.statusNames.${s}`)}
                        </option>
                      ))}
                    </select>
                    {canDelete && <DeleteButton onClick={() => setDeleting(lead)} label={t("common.delete")} />}
                  </div>
                </div>
                <input
                  value={lead.note ?? ""}
                  placeholder={t("leads.notePlaceholder")}
                  onBlur={(e) => {
                    if (e.target.value !== (lead.note ?? "")) void updateLead(lead.id, { note: e.target.value });
                  }}
                  onChange={(e) => setLeads((list) => list.map((l) => (l.id === lead.id ? { ...l, note: e.target.value } : l)))}
                  className="mt-3 w-full max-w-xl rounded-lg border border-transparent bg-paper px-3 py-2 text-[13px] text-ink/70 outline-none transition-colors focus:border-ink/20 focus:bg-white"
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      {pages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="grid size-9 place-items-center rounded-lg border border-ink/10 text-sm text-ink/60 disabled:opacity-40"
          >
            {t("common.prev")}
          </button>
          <span className="text-sm text-ink/50">
            {page} {t("common.of")} {pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page >= pages}
            className="grid size-9 place-items-center rounded-lg border border-ink/10 text-sm text-ink/60 disabled:opacity-40"
          >
            {t("common.next")}
          </button>
        </div>
      )}

      <ConfirmModal
        open={deleting !== null}
        title={t("leads.deleteConfirm")}
        text={t("common.confirmDeleteText")}
        loading={deleteLoading}
        onConfirm={() => void confirmDelete()}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}
