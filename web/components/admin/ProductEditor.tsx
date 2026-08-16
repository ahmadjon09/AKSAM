// Product create/edit form: tabs for uz/ru/en, quality highlights per
// locale, image upload through the API (ImgBB) with reorder/remove, plus
// category, sort order and the active flag. Save posts PATCH/POST and shows
// loading + toasts; nothing reloads the page.

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, ImagePlus, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { FieldWrap, TextArea, TextInput } from "@/components/ui/Field";
import { Spinner } from "@/components/ui/Spinner";
import { adminApi } from "@/lib/api";
import { adminCall, adminErrorMessage } from "@/lib/admin";
import { useUiStore } from "@/lib/store/ui";
import { cn, slugify } from "@/lib/utils";
import type { CategoryDto, Lang, ProductDto } from "@/lib/types";

const LANGS: Lang[] = ["uz", "ru", "en"];
const EMPTY_LOCALE = { name: "", short: "", description: "", metaTitle: "", metaDesc: "", highlights: "", specs: "" };

interface FormState {
  slug: string;
  categoryId: string;
  sortOrder: number;
  isActive: boolean;
  images: string[];
  locales: Record<Lang, typeof EMPTY_LOCALE>;
}

function productToForm(product: ProductDto | null): FormState {
  const locales = {} as FormState["locales"];
  for (const lang of LANGS) {
    locales[lang] = {
      name: product?.name[lang] ?? "",
      short: product?.short[lang] ?? "",
      description: product?.description[lang] ?? "",
      metaTitle: product?.metaTitle[lang] ?? "",
      metaDesc: product?.metaDesc[lang] ?? "",
      highlights: (product?.highlights[lang] ?? []).join("\n"),
      specs: (product?.specs[lang] ?? []).map((sp) => `${sp.label}: ${sp.value}`).join("\n")
    };
  }
  return {
    slug: product?.slug ?? "",
    categoryId: product?.category?.slug ?? "",
    sortOrder: product?.sortOrder ?? 0,
    isActive: product?.isActive ?? true,
    images: product?.images ?? [],
    locales
  };
}

export function ProductEditor({
  product,
  categories,
  onDone
}: {
  product: ProductDto | null;
  categories: CategoryDto[];
  onDone: () => void;
}) {
  const { t } = useTranslation();
  const pushToast = useUiStore((s) => s.pushToast);
  const [tab, setTab] = useState<Lang>("uz");
  const [form, setForm] = useState<FormState>(() => productToForm(product));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ slug?: string; name?: boolean; image?: boolean }>({});

  // Rebuild the form when the target product changes (edit vs create).
  useEffect(() => {
    setForm(productToForm(product));
    setTab("uz");
  }, [product]);

  const setLocale = (lang: Lang, key: keyof typeof EMPTY_LOCALE, value: string) => {
    setForm((f) => ({ ...f, locales: { ...f.locales, [lang]: { ...f.locales[lang], [key]: value } } }));
  };

  const handleUpload = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const res = await adminCall((token) => adminApi.uploadImage(token, file));
      setForm((f) => ({ ...f, images: [...f.images, res.url] }));
    } catch {
      pushToast({ kind: "error", title: t("products.form.uploadError") });
    } finally {
      setUploading(false);
    }
  };

  const moveImage = (index: number, dir: -1 | 1) => {
    setForm((f) => {
      const images = [...f.images];
      const target = index + dir;
      if (target < 0 || target >= images.length) return f;
      [images[index], images[target]] = [images[target], images[index]];
      return { ...f, images };
    });
  };

  const removeImage = (index: number) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) }));
  };

  const handleSave = async () => {
    const next: typeof fieldErrors = {};
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug)) next.slug = "invalid";
    if (!form.locales.uz.name.trim() || !form.locales.ru.name.trim() || !form.locales.en.name.trim()) next.name = true;
    if (form.images.length === 0) next.image = true;
    setFieldErrors(next);
    if (Object.keys(next).length > 0) {
      pushToast({ kind: "error", title: t("errors.validation") });
      return;
    }

    const category = categories.find((c) => c.slug === form.categoryId);
    const payload = {
      slug: form.slug,
      categoryId: category?.id,
      sortOrder: form.sortOrder,
      isActive: form.isActive,
      images: form.images,
      name: { uz: form.locales.uz.name.trim(), ru: form.locales.ru.name.trim(), en: form.locales.en.name.trim() },
      short: { uz: form.locales.uz.short.trim(), ru: form.locales.ru.short.trim(), en: form.locales.en.short.trim() },
      description: { uz: form.locales.uz.description.trim(), ru: form.locales.ru.description.trim(), en: form.locales.en.description.trim() },
      metaTitle: { uz: form.locales.uz.metaTitle.trim(), ru: form.locales.ru.metaTitle.trim(), en: form.locales.en.metaTitle.trim() },
      metaDesc: { uz: form.locales.uz.metaDesc.trim(), ru: form.locales.ru.metaDesc.trim(), en: form.locales.en.metaDesc.trim() },
      highlights: {
        uz: lines(form.locales.uz.highlights),
        ru: lines(form.locales.ru.highlights),
        en: lines(form.locales.en.highlights)
      },
      specs: {
        uz: specLines(form.locales.uz.specs),
        ru: specLines(form.locales.ru.specs),
        en: specLines(form.locales.en.specs)
      }
    };

    setSaving(true);
    try {
      if (product) {
        await adminCall((token) => adminApi.updateProduct(token, product.id, payload));
      } else {
        await adminCall((token) => adminApi.createProduct(token, payload));
      }
      pushToast({ kind: "success", title: t("common.saved") });
      onDone();
    } catch (err) {
      pushToast({ kind: "error", title: t("errors.generic"), description: adminErrorMessage(err, t) });
    } finally {
      setSaving(false);
    }
  };

  const locale = form.locales[tab];

  return (
    <div className="space-y-6">
      {/* Language tabs */}
      <div className="flex gap-1 border-b border-ink/8">
        {LANGS.map((lang) => (
          <button
            key={lang}
            onClick={() => setTab(lang)}
            className={cn(
              "relative px-4 py-2.5 text-sm font-semibold transition-colors",
              tab === lang ? "text-brand" : "text-ink/45 hover:text-ink"
            )}
          >
            {t(`products.form.tab${lang.charAt(0).toUpperCase() + lang.slice(1)}`)}
            {tab === lang && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-brand" />}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <FieldWrap label={t("products.form.nameLabel")} required error={fieldErrors.name ? t("products.form.errors.nameRequired") : undefined}>
          <TextInput value={locale.name} onChange={(e) => setLocale(tab, "name", e.target.value)} disabled={saving} />
        </FieldWrap>
        <FieldWrap label={t("products.form.slugLabel")} hint={t("products.form.slugHint")} error={fieldErrors.slug ? t("products.form.errors.slugInvalid") : undefined}>
          <TextInput
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
            disabled={saving || !!product}
          />
        </FieldWrap>
      </div>

      <FieldWrap label={t("products.form.shortLabel")} hint={t("products.form.shortHint")}>
        <TextArea value={locale.short} onChange={(e) => setLocale(tab, "short", e.target.value)} disabled={saving} />
      </FieldWrap>
      <FieldWrap label={t("products.form.descLabel")} hint={t("products.form.descHint")}>
        <TextArea value={locale.description} onChange={(e) => setLocale(tab, "description", e.target.value)} disabled={saving} />
      </FieldWrap>

      <div className="grid gap-5 lg:grid-cols-2">
        <FieldWrap label={t("products.form.metaTitleLabel")} hint={t("products.form.metaTitleHint")}>
          <TextInput value={locale.metaTitle} onChange={(e) => setLocale(tab, "metaTitle", e.target.value)} disabled={saving} />
        </FieldWrap>
        <FieldWrap label={t("products.form.metaDescLabel")} hint={t("products.form.metaDescHint")}>
          <TextArea value={locale.metaDesc} onChange={(e) => setLocale(tab, "metaDesc", e.target.value)} disabled={saving} />
        </FieldWrap>
      </div>

      <FieldWrap label={t("products.form.highlightsLabel")} hint={t("products.form.highlightsHint")}>
        <TextArea
          value={locale.highlights}
          onChange={(e) => setLocale(tab, "highlights", e.target.value)}
          placeholder={t("products.form.highlightsPlaceholder")}
          disabled={saving}
        />
      </FieldWrap>

      <FieldWrap label={t("products.form.specsLabel")} hint={t("products.form.specsHint")}>
        <TextArea
          value={locale.specs}
          onChange={(e) => setLocale(tab, "specs", e.target.value)}
          placeholder={t("products.form.specsPlaceholder")}
          disabled={saving}
        />
      </FieldWrap>

      {/* Images */}
      <FieldWrap label={t("products.form.imagesLabel")} hint={t("products.form.imagesHint")} error={fieldErrors.image ? t("products.form.errors.imageRequired") : undefined}>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {form.images.map((url, i) => (
            <div key={url + i} className="group relative aspect-square overflow-hidden rounded-lg ring-1 ring-ink/10">
              <Image src={url} alt="" fill sizes="140px" className="object-cover" unoptimized={/^https?:/.test(url)} />
              <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-ink/60 opacity-0 transition-opacity group-hover:opacity-100">
                <button onClick={() => moveImage(i, -1)} aria-label="Up" className="grid size-8 place-items-center rounded-full bg-white/90 text-ink hover:bg-white">
                  <ArrowUp className="size-3.5" />
                </button>
                <button onClick={() => moveImage(i, 1)} aria-label="Down" className="grid size-8 place-items-center rounded-full bg-white/90 text-ink hover:bg-white">
                  <ArrowDown className="size-3.5" />
                </button>
                <button onClick={() => removeImage(i)} aria-label="Remove" className="grid size-8 place-items-center rounded-full bg-brand text-white hover:bg-brand-dark">
                  <X className="size-3.5" />
                </button>
              </div>
              {i === 0 && (
                <span className="absolute left-1.5 top-1.5 rounded bg-brand px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
                  {t("products.form.mainLabel")}
                </span>
              )}
            </div>
          ))}
          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-ink/15 text-ink/40 transition-colors hover:border-brand/50 hover:text-brand">
            {uploading ? <Spinner size="md" tone="dark" /> : <ImagePlus className="size-5" />}
            <span className="px-2 text-center text-[11px] font-semibold leading-tight">{t("products.form.upload")}</span>
            <input type="file" accept="image/*" className="hidden" disabled={uploading || saving} onChange={(e) => void handleUpload(e.target.files?.[0])} />
          </label>
        </div>
      </FieldWrap>

      <div className="grid gap-5 sm:grid-cols-3">
        <FieldWrap label={t("products.form.categoryLabel")} required>
          <select
            value={form.categoryId}
            onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
            disabled={saving}
            className="h-11 w-full rounded-lg border border-ink/15 bg-white px-3 text-[15px] text-ink outline-none focus:ring-2 focus:ring-ink/10"
          >
            <option value="">—</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name.ru || c.name.uz}
              </option>
            ))}
          </select>
        </FieldWrap>
        <FieldWrap label={t("products.form.sortOrderLabel")} hint={t("products.form.sortOrderHint")}>
          <TextInput type="number" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: parseInt(e.target.value, 10) || 0 }))} disabled={saving} />
        </FieldWrap>
        <div className="flex items-end pb-1">
          <label className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-ink/10 bg-white px-4 py-2.5">
            <span className="text-sm font-semibold text-ink">{t("products.form.activeLabel")}</span>
            <span
              className={cn("relative h-6 w-11 rounded-full transition-colors", form.isActive ? "bg-brand" : "bg-neutral-300")}
            >
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                className="peer sr-only"
                disabled={saving}
              />
              <span
                className={cn(
                  "absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow transition-transform",
                  form.isActive && "translate-x-5"
                )}
              />
            </span>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-ink/8 pt-5">
        <Button variant="outline" onClick={onDone}>
          {t("common.cancel")}
        </Button>
        <Button onClick={handleSave} loading={saving}>
          {t("common.save")}
        </Button>
      </div>
    </div>
  );
}

function lines(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 20);
}

function specLines(text: string): { label: string; value: string }[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 20)
    .map((line) => {
      const idx = line.indexOf(":");
      if (idx === -1) return { label: line, value: "" };
      return { label: line.slice(0, idx).trim(), value: line.slice(idx + 1).trim() };
    });
}
