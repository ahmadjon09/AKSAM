// Admin login screen: split layout with the brand panel on the left and the
// form on the right. Submitting shows the button spinner; errors appear
// inline, never in a raw alert.

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { FieldWrap, TextInput } from "@/components/ui/Field";
import { Logo } from "@/components/ui/Logo";
import { useAuthStore } from "@/lib/store/auth";
import { ApiError } from "@/lib/api";

export function LoginView() {
  const { t } = useTranslation();
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = t("login.emailError");
    if (password.length < 6) next.password = t("login.passwordError");
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      await login(email.trim().toLowerCase(), password);
      router.replace("/admin/dashboard");
    } catch (err) {
      const message =
        err instanceof ApiError && err.status === 429 ? t("errors.rateLimited") : t("login.error");
      setErrors({ form: message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-ink lg:block">
        <div className="pointer-events-none absolute -left-32 top-1/3 size-96 rounded-full bg-brand/20 blur-[140px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-[3px] w-full bg-brand" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Logo />
          <div>
            <p className="text-4xl font-bold leading-tight tracking-tight text-white">
              {t("login.title")}
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/55">{t("login.subtitle")}</p>
          </div>
          <Link href="/uz" className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 transition-colors hover:text-white">
            <ArrowLeft className="size-4" />
            {t("login.backToSite")}
          </Link>
        </div>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center bg-neutral-100 p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">{t("login.title")}</h1>
          <p className="mt-1 text-sm text-ink/50">{t("login.subtitle")}</p>

          {errors.form && (
            <div className="mt-5 rounded-lg border border-brand/30 bg-brand/5 px-4 py-3 text-[13.5px] font-medium text-brand">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            <FieldWrap label={t("login.email")} required error={errors.email}>
              <TextInput
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@aksam.uz"
                autoComplete="email"
                invalid={!!errors.email}
                disabled={submitting}
              />
            </FieldWrap>
            <FieldWrap label={t("login.password")} required error={errors.password}>
              <TextInput
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                invalid={!!errors.password}
                disabled={submitting}
              />
            </FieldWrap>
            <Button type="submit" fullWidth size="lg" loading={submitting}>
              {t("login.submit")}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
