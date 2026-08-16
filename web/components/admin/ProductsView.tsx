// Product list: search across all languages, active toggle, edit/delete.
// The editor opens in a side sheet; deleting asks for confirmation and only
// ADMIN+ roles see the delete button.

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Pencil, Plus, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ConfirmModal, DeleteButton, EmptyState, PageHeading } from "@/components/admin/AdminUI";
import { ProductEditor } from "@/components/admin/ProductEditor";
import { Button } from "@/components/ui/Button";
import { adminApi } from "@/lib/api";
import { adminCall } from "@/lib/admin";
import { useAuthStore } from "@/lib/store/auth";
import { useUiStore } from "@/lib/store/ui";
import { cn, formatDate } from "@/lib/utils";
import type { CategoryDto, ProductDto } from "@/lib/types";

export function ProductsView() {
  const { t } = useTranslation();
  const pushToast = useUiStore((s) => s.pushToast);
  const user = useAuthStore((s) => s.user);
  const canDelete = user?.role === "SUPERADMIN" || user?.role === "ADMIN";

  const [products, setProducts] = useState<ProductDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<ProductDto | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<ProductDto | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        adminCall((token) => adminApi.listProducts(token)),
        adminCall((token) => adminApi.listCategories(token))
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch {
      pushToast({ kind: "error", title: t("errors.generic") });
    } finally {
      setLoading(false);
    }
  }, [pushToast, t]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      [p.name.uz, p.name.ru, p.name.en, p.slug].join(" ").toLowerCase().includes(q)
    );
  }, [products, query]);

  const toggleActive = async (product: ProductDto) => {
    try {
      await adminCall((token) => adminApi.updateProduct(token, product.id, { isActive: !product.isActive }));
      setProducts((list) => list.map((p) => (p.id === product.id ? { ...p, isActive: !p.isActive } : p)));
    } catch {
      pushToast({ kind: "error", title: t("errors.generic") });
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeleteLoading(true);
    try {
      await adminCall((token) => adminApi.deleteProduct(token, deleting.id));
      setProducts((list) => list.filter((p) => p.id !== deleting.id));
      pushToast({ kind: "success", title: t("common.saved") });
      setDeleting(null);
    } catch {
      pushToast({ kind: "error", title: t("errors.generic") });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      <PageHeading
        title={t("products.title")}
        subtitle={t("products.subtitle")}
        action={
          <Button icon={<Plus className="size-4" />} onClick={() => setCreating(true)}>
            {t("products.add")}
          </Button>
        }
      />

      <div className="mb-5 flex items-center gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink/35" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("common.search")}
            className="h-10 w-full rounded-lg border border-ink/10 bg-white pl-9 pr-3 text-sm outline-none focus:border-ink"
          />
        </div>
        <p className="text-[12.5px] text-ink/40">{filtered.length}</p>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-neutral-200" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<Search className="size-8" />} text={t("products.empty")} />
      ) : (
        <div className="overflow-hidden rounded-xl border border-ink/8 bg-white">
          <ul className="divide-y divide-ink/6">
            {filtered.map((product) => (
              <li key={product.id} className="flex items-center gap-4 px-4 py-3">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-paper ring-1 ring-ink/8">
                  {product.images[0] && (
                    <Image src={product.images[0]} alt="" fill sizes="48px" className="object-cover" unoptimized={/^https?:/.test(product.images[0])} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{product.name.ru || product.name.uz}</p>
                  <p className="truncate text-[12px] text-ink/45">
                    /{product.slug} · {product.category?.name.uz} · {formatDate(product.updatedAt, "ru")}
                  </p>
                </div>
                <button
                  onClick={() => void toggleActive(product)}
                  className={cn("hidden rounded-full px-3 py-1.5 text-[11.5px] font-bold sm:block", product.isActive ? "bg-emerald-100 text-emerald-700" : "bg-neutral-200 text-neutral-500")}
                >
                  {product.isActive ? t("products.active") : t("products.inactive")}
                </button>
                <button
                  onClick={() => setEditing(product)}
                  aria-label={t("common.edit")}
                  className="grid size-9 place-items-center rounded-lg border border-ink/10 text-ink/45 transition-colors hover:border-ink/40 hover:text-ink"
                >
                  <Pencil className="size-4" />
                </button>
                {canDelete && <DeleteButton onClick={() => setDeleting(product)} label={t("common.delete")} />}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Editor side sheet */}
      {(creating || editing) && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={() => { setCreating(false); setEditing(null); }} />
          <div className="absolute inset-y-0 right-0 flex w-full max-w-2xl flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-ink/8 px-6 py-4">
              <h2 className="text-lg font-bold tracking-tight text-ink">
                {creating ? t("products.createTitle") : t("products.editTitle")}
              </h2>
              <button onClick={() => { setCreating(false); setEditing(null); }} className="text-ink/40 hover:text-ink" aria-label={t("common.close")}>
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <ProductEditor
                product={editing}
                categories={categories}
                onDone={() => {
                  setCreating(false);
                  setEditing(null);
                  void load();
                }}
              />
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={deleting !== null}
        title={t("products.deleteConfirm")}
        text={t("common.confirmDeleteText")}
        loading={deleteLoading}
        onConfirm={() => void confirmDelete()}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}
