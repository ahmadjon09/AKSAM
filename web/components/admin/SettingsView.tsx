// Settings form: site info, contact details, map coordinates and social
// links. ADMIN+ only; the API enforces it, the UI just hides the button
// visibility differences.

"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PageHeading } from "@/components/admin/AdminUI";
import { Button } from "@/components/ui/Button";
import { FieldWrap, TextInput } from "@/components/ui/Field";
import { adminApi } from "@/lib/api";
import { adminCall } from "@/lib/admin";
import { useUiStore } from "@/lib/store/ui";
import type { PublicSettingsDto } from "@/lib/types";

export function SettingsView() {
  const { t } = useTranslation();
  const pushToast = useUiStore((s) => s.pushToast);
  const [form, setForm] = useState<PublicSettingsDto | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await adminCall((token) => adminApi.getSettings(token));
      setForm(res.data);
    } catch {
      pushToast({ kind: "error", title: t("errors.generic") });
    }
  }, [pushToast, t]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!form) {
    return <div className="h-72 animate-pulse rounded-xl bg-neutral-200" />;
  }

  const set = <K extends keyof PublicSettingsDto>(key: K, value: PublicSettingsDto[K]) => {
    setForm((f) => (f ? { ...f, [key]: value } : f));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminCall((token) =>
        adminApi.updateSettings(token, {
          siteName: form.siteName,
          tagline: form.tagline.uz,
          phone: form.phone,
          phone2: form.phone2,
          email: form.email,
          address: form.address.uz,
          workHours: form.workHours.uz,
          mapLat: form.mapLat,
          mapLng: form.mapLng,
          mapLabel: form.mapLabel.uz,
          instagram: form.instagram,
          telegram: form.telegram,
          facebook: form.facebook
        })
      );
      pushToast({ kind: "success", title: t("common.saved") });
    } catch {
      pushToast({ kind: "error", title: t("errors.generic") });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeading title={t("settings.title")} subtitle={t("settings.subtitle")} />
      <div className="max-w-2xl space-y-5 rounded-xl border border-ink/8 bg-white p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <FieldWrap label={t("settings.siteName")}>
            <TextInput value={form.siteName} onChange={(e) => set("siteName", e.target.value)} disabled={saving} />
          </FieldWrap>
          <FieldWrap label={t("settings.tagline")}>
            <TextInput value={form.tagline.uz} onChange={(e) => set("tagline", { uz: e.target.value, ru: e.target.value, en: e.target.value })} disabled={saving} />
          </FieldWrap>
          <FieldWrap label={t("settings.phone")}>
            <TextInput value={form.phone} onChange={(e) => set("phone", e.target.value)} disabled={saving} />
          </FieldWrap>
          <FieldWrap label={t("settings.phone2")}>
            <TextInput value={form.phone2} onChange={(e) => set("phone2", e.target.value)} disabled={saving} />
          </FieldWrap>
          <FieldWrap label={t("settings.email")}>
            <TextInput type="email" value={form.email} onChange={(e) => set("email", e.target.value)} disabled={saving} />
          </FieldWrap>
          <FieldWrap label={t("settings.workHours")}>
            <TextInput value={form.workHours.uz} onChange={(e) => set("workHours", { uz: e.target.value, ru: e.target.value, en: e.target.value })} disabled={saving} />
          </FieldWrap>
        </div>
        <FieldWrap label={t("settings.address")}>
          <TextInput value={form.address.uz} onChange={(e) => set("address", { uz: e.target.value, ru: e.target.value, en: e.target.value })} disabled={saving} />
        </FieldWrap>
        <FieldWrap label={t("settings.mapLabel")}>
          <TextInput value={form.mapLabel.uz} onChange={(e) => set("mapLabel", { uz: e.target.value, ru: e.target.value, en: e.target.value })} disabled={saving} />
        </FieldWrap>
        <div className="grid gap-5 sm:grid-cols-2">
          <FieldWrap label={t("settings.mapLat")}>
            <TextInput value={form.mapLat} onChange={(e) => set("mapLat", parseFloat(e.target.value) || 0)} disabled={saving} />
          </FieldWrap>
          <FieldWrap label={t("settings.mapLng")}>
            <TextInput value={form.mapLng} onChange={(e) => set("mapLng", parseFloat(e.target.value) || 0)} disabled={saving} />
          </FieldWrap>
          <FieldWrap label={t("settings.instagram")}>
            <TextInput value={form.instagram} onChange={(e) => set("instagram", e.target.value)} disabled={saving} />
          </FieldWrap>
          <FieldWrap label={t("settings.telegram")}>
            <TextInput value={form.telegram} onChange={(e) => set("telegram", e.target.value)} disabled={saving} />
          </FieldWrap>
        </div>
        <div className="flex justify-end border-t border-ink/8 pt-5">
          <Button onClick={handleSave} loading={saving}>
            {t("common.save")}
          </Button>
        </div>
      </div>
    </div>
  );
}
