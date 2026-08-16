// Inline order form on the product page: name + phone only, per the brand's
// rules. Validates locally, then posts to the API which forwards the lead to
// the Telegram channel. Success state renders in place — no page reload.

"use client";

import { useState } from "react";
import { CheckCircle2, LockKeyhole } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { FieldWrap, TextInput } from "@/components/ui/Field";
import { submitOrder } from "@/lib/api";
import { useUiStore } from "@/lib/store/ui";
import { isValidPhone, normalizePhone } from "@/lib/utils";
import type { Lang, ProductDto } from "@/lib/types";

export function ProductOrderForm({ product, lang }: { product: ProductDto; lang: Lang }) {
  const { t } = useTranslation();
  const pushToast = useUiStore((s) => s.pushToast);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: typeof errors = {};
    if (name.trim().length < 2) nextErrors.name = t("orderForm.nameError");
    if (!isValidPhone(phone)) nextErrors.phone = t("orderForm.phoneError");
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await submitOrder({
        fullName: name.trim(),
        phone: normalizePhone(phone),
        productSlug: product.slug,
        productName: product.name[lang] || product.name.uz,
        lang
      });
      setDone(true);
      pushToast({ kind: "success", title: t("orderForm.successTitle"), description: t("orderForm.successText") });
    } catch {
      pushToast({ kind: "error", title: t("errors.generic"), description: t("errors.generic") });
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="flex h-full min-h-[260px] flex-col items-center justify-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-8 text-center">
        <CheckCircle2 className="size-10 text-emerald-600" strokeWidth={1.8} />
        <div>
          <h3 className="text-xl font-bold tracking-tight text-ink">{t("orderForm.successTitle")}</h3>
          <p className="mt-1.5 text-sm text-ink/60">{t("orderForm.successText")}</p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-ink/8 bg-paper p-6 sm:p-7"
      aria-labelledby="product-order-title"
    >
      <h3 id="product-order-title" className="text-lg font-bold tracking-tight text-ink">
        {t("product.orderTitle")}
      </h3>
      <p className="mt-1 text-[13.5px] text-ink/55">{t("product.orderSubtitle")}</p>

      <div className="mt-5 space-y-4">
        <FieldWrap label={t("orderForm.name")} required error={errors.name}>
          <TextInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("orderForm.namePlaceholder")}
            autoComplete="name"
            invalid={!!errors.name}
            disabled={submitting}
          />
        </FieldWrap>
        <FieldWrap label={t("orderForm.phone")} required error={errors.phone}>
          <TextInput
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t("orderForm.phonePlaceholder")}
            inputMode="tel"
            autoComplete="tel"
            invalid={!!errors.phone}
            disabled={submitting}
          />
        </FieldWrap>
        <Button type="submit" fullWidth size="lg" loading={submitting}>
          {t("orderForm.submit")}
        </Button>
        <p className="flex items-start gap-1.5 text-[12px] leading-relaxed text-ink/45">
          <LockKeyhole className="mt-0.5 size-3.5 shrink-0" />
          {t("orderForm.privacy")}
        </p>
      </div>
    </form>
  );
}
