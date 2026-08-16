// Category management: compact table plus a side-sheet editor with the same
// trilingual pattern as products and an image upload.

"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Pencil, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ConfirmModal, DeleteButton, EmptyState, PageHeading } from "@/components/admin/AdminUI";
import { Button } from "@/components/ui/Button";
import { FieldWrap, TextArea, TextInput } from "@/components/ui/Field";
import { Spinner } from "@/components/ui/Spinner";
import { adminApi } from "@/lib/api";
import { adminCall, adminErrorMessage } from "@/lib/admin";
import { useAuthStore } from "@/lib/store/auth";
import { useUiStore } from "@/lib/store/ui";
import { cn, slugify } from "@/lib/utils";
import type { CategoryDto, Lang } from "@/lib/types";

interface CatRow extends CategoryDto {
  productsCount?: number;
}

export function CategoriesView() {
  const { t } = useTranslation();
  const pushToast = useUiStore((s) => s.pushToast);
  const user = useAuthStore((s) => s.user);
  const canDelete = user?.role === "SUPERADMIN" || user?.role === "ADMIN";

  const [rows, setRows] = useState<CatRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<CategoryDto | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<CategoryDto | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await adminCall((token) => adminApi.listCategories(token));
      setRows(res.data as CatRow[]);
    } catch {
      pushToast({ kind: "error", title: t("errors.generic") });
    } finally {
      setLoading(false);
    }
  }, [pushToast, t]);

  useEffect(() => {
    void load();
  }, [load]);

  const toggleActive = async (cat: CategoryDto) => {
    try {
      await adminCall((token) => adminApi.updateCategory(token, cat.id, { isActive: !cat.isActive }));
      setRows((list) => list.map((c) => (c.id === cat.id ? { ...c, isActive: !c.isActive } : c)));
    } catch {
      pushToast({ kind: "error", title: t("errors.generic") });
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeleteLoading(true);
    try {
      await adminCall((token) => adminApi.deleteCategory(token, deleting.id));
      setRows((list) => list.filter((c) => c.id !== deleting.id));
      pushToast({ kind: "success", title: t("common.saved") });
      setDeleting(null);
    } catch (err) {
      pushToast({ kind: "error", title: t("errors.generic"), description: adminErrorMessage(err, t) });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      <PageHeading
        title={t("categories.title")}
        subtitle={t("categories.subtitle")}
        action={
          <Button icon={<Plus className="size-4" />} onClick={() => setCreating(true)}>
            {t("categories.add")}
          </Button>
        }
      />

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-neutral-200" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <EmptyState icon={<Plus className="size-8" />} text={t("categories.empty")} />
      ) : (
        <div className="overflow-hidden rounded-xl border border-ink/8 bg-white">
          <ul className="divide-y divide-ink/6">
            {rows.map((cat) => (
              <li key={cat.id} className="flex items-center gap-4 px-4 py-3">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-paper ring-1 ring-ink/8">
                  {cat.image && (
                    <Image src={cat.image} alt="" fill sizes="48px" className="object-cover" unoptimized={/^https?:/.test(cat.image)} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{cat.name.ru || cat.name.uz}</p>
                  <p className="truncate text-[12px] text-ink/45">
                    /{cat.slug} · {cat.productsCount ?? 0} {t("categories.productsCount").toLowerCase()}
                  </p>
                </div>
                <button
                  onClick={() => void toggleActive(cat)}
                  className={cn("hidden rounded-full px-3 py-1.5 text-[11.5px] font-bold sm:block", cat.isActive ? "bg-emerald-100 text-emerald-700" : "bg-neutral-200 text-neutral-500")}
                >
                  {cat.isActive ? t("common.active") : t("common.inactive")}
                </button>
                <button
                  onClick={() => setEditing(cat)}
                  aria-label={t("common.edit")}
                  className="grid size-9 place-items-center rounded-lg border border-ink/10 text-ink/45 transition-colors hover:border-ink/40 hover:text-ink"
                >
                  <Pencil className="size-4" />
                </button>
                {canDelete && <DeleteButton onClick={() => setDeleting(cat)} label={t("common.delete")} />}
              </li>
            ))}
          </ul>
        </div>
      )}

      {(creating || editing) && (
        <CategoryEditor
          category={editing}
          onDone={() => {
            setCreating(false);
            setEditing(null);
            void load();
          }}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
        />
      )}

      <ConfirmModal
        open={deleting !== null}
        title={t("categories.deleteConfirm")}
        text={t("common.confirmDeleteText")}
        loading={deleteLoading}
        onConfirm={() => void confirmDelete()}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}

function CategoryEditor({ category, onDone, onClose }: { category: CategoryDto | null; onDone: () => void; onClose: () => void }) {
  const { t } = useTranslation();
  const pushToast = useUiStore((s) => s.pushToast);
  const [tab, setTab] = useState<Lang>("uz");
  const [form, setForm] = useState(() => ({
    slug: category?.slug ?? "",
    image: category?.image ?? "",
    sortOrder: category?.sortOrder ?? 0,
    isActive: category?.isActive ?? true,
    locales: {
      uz: { name: category?.name.uz ?? "", desc: category?.description.uz ?? "" },
      ru: { name: category?.name.ru ?? "", desc: category?.description.ru ?? "" },
      en: { name: category?.name.en ?? "", desc: category?.description.en ?? "" }
    }
  }));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        slug: form.slug,
        image: form.image || undefined,
        sortOrder: form.sortOrder,
        isActive: form.isActive,
        name: { uz: form.locales.uz.name.trim(), ru: form.locales.ru.name.trim(), en: form.locales.en.name.trim() },
        description: { uz: form.locales.uz.desc.trim(), ru: form.locales.ru.desc.trim(), en: form.locales.en.desc.trim() }
      };
      if (category) {
        await adminCall((token) => adminApi.updateCategory(token, category.id, payload));
      } else {
        await adminCall((token) => adminApi.createCategory(token, payload));
      }
      pushToast({ kind: "success", title: t("common.saved") });
      onDone();
    } catch (err) {
      pushToast({ kind: "error", title: t("errors.generic"), description: adminErrorMessage(err, t) });
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const res = await adminCall((token) => adminApi.uploadImage(token, file));
      setForm((f) => ({ ...f, image: res.url }));
    } catch {
      pushToast({ kind: "error", title: t("products.form.uploadError") });
    } finally {
      setUploading(false);
    }
  };

  const locale = form.locales[tab];

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-ink/8 px-6 py-4">
          <h2 className="text-lg font-bold tracking-tight text-ink">{category ? t("categories.editTitle") : t("categories.createTitle")}</h2>
          <button onClick={onClose} className="text-ink/40 hover:text-ink" aria-label={t("common.close")}>
            ✕
          </button>
        </div>
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          <div className="flex gap-1 border-b border-ink/8">
            {(["uz", "ru", "en"] as Lang[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setTab(lang)}
                className={cn("relative px-4 py-2.5 text-sm font-semibold transition-colors", tab === lang ? "text-brand" : "text-ink/45 hover:text-ink")}
              >
                {lang.toUpperCase()}
                {tab === lang && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-brand" />}
              </button>
            ))}
          </div>
          <FieldWrap label={t("categories.form.nameLabel")} required>
            <TextInput value={locale.name} onChange={(e) => setForm((f) => ({ ...f, locales: { ...f.locales, [tab]: { ...f.locales[tab], name: e.target.value } } }))} disabled={saving} />
          </FieldWrap>
          <FieldWrap label={t("categories.form.descLabel")} hint={t("categories.form.descHint")}>
            <TextArea value={locale.desc} onChange={(e) => setForm((f) => ({ ...f, locales: { ...f.locales, [tab]: { ...f.locales[tab], desc: e.target.value } } }))} disabled={saving} />
          </FieldWrap>
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldWrap label={t("categories.form.slugLabel")} hint={t("categories.form.slugHint")}>
              <TextInput value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))} disabled={saving || !!category} />
            </FieldWrap>
            <FieldWrap label={t("categories.form.sortOrderLabel")}>
              <TextInput type="number" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: parseInt(e.target.value, 10) || 0 }))} disabled={saving} />
            </FieldWrap>
          </div>
          <FieldWrap label={t("categories.form.imageLabel")} hint={t("categories.form.imageHint")}>
            <div className="flex items-center gap-4">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-paper ring-1 ring-ink/10">
                {form.image && <Image src={form.image} alt="" fill sizes="64px" className="object-cover" unoptimized />}
              </div>
              <label className="inline-flex h-10 cursor-pointer items-center rounded-full border border-ink/15 px-5 text-[13px] font-semibold text-ink transition-colors hover:border-ink">
                {uploading ? <Spinner size="sm" tone="dark" /> : t("products.form.upload")}
                <input type="file" accept="image/*" className="hidden" disabled={uploading || saving} onChange={(e) => void handleUpload(e.target.files?.[0])} />
              </label>
            </div>
          </FieldWrap>
          <div className="flex justify-end gap-3 border-t border-ink/8 pt-5">
            <Button variant="outline" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleSave} loading={saving}>
              {t("common.save")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
