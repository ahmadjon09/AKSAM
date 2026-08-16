// Contact page form: name + phone + optional message. Mirrors the order
// form behaviour: local validation, optimistic UI, success in place, and a
// toast on top. The backend forwards it to Telegram as a CONTACT lead.

"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { FieldWrap, TextArea, TextInput } from "@/components/ui/Field";
import { submitContact } from "@/lib/api";
import { useUiStore } from "@/lib/store/ui";
import { isValidPhone, normalizePhone } from "@/lib/utils";
import type { Lang } from "@/lib/types";

export function ContactForm({ lang }: { lang: Lang }) {
  const { t } = useTranslation();
  const pushToast = useUiStore((s) => s.pushToast);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
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
      await submitContact({
        fullName: name.trim(),
        phone: normalizePhone(phone),
        message: message.trim() || undefined,
        lang
      });
      setDone(true);
      pushToast({ kind: "success", title: t("orderForm.successTitle"), description: t("orderForm.successText") });
    } catch {
      pushToast({ kind: "error", title: t("errors.generic") });
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="flex min-h-[380px] flex-col items-center justify-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-8 text-center">
        <CheckCircle2 className="size-11 text-emerald-600" strokeWidth={1.7} />
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
      className="rounded-2xl border border-ink/8 bg-white p-6 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.35)] sm:p-8"
    >
      <h2 className="text-xl font-bold tracking-tight text-ink">{t("contact.formTitle")}</h2>
      <p className="mt-1 text-[13.5px] text-ink/55">{t("contact.formSubtitle")}</p>
      <div className="mt-6 space-y-4">
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
        <FieldWrap label={t("orderForm.message")}>
          <TextArea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("orderForm.messagePlaceholder")}
            disabled={submitting}
          />
        </FieldWrap>
        <Button type="submit" fullWidth size="lg" loading={submitting} icon={<Send className="size-4" />}>
          {t("orderForm.submit")}
        </Button>
        <p className="text-[12px] leading-relaxed text-ink/45">{t("orderForm.privacy")}</p>
      </div>
    </form>
  );
}
