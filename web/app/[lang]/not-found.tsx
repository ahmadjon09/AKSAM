// Localized 404 with links back to home and the catalog.

"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Home } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();
  const params = useParams<{ lang?: string }>();
  const lang = params?.lang ?? "uz";

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 pt-24">
      <div className="text-center">
        <p className="text-8xl font-extrabold leading-none tracking-tight text-brand">404</p>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-ink sm:text-3xl">{t("notFound.title")}</h1>
        <p className="mx-auto mt-3 max-w-sm text-[15px] text-ink/55">{t("notFound.text")}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={`/${lang}`}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            <Home className="size-4" />
            {t("notFound.button")}
          </Link>
          <Link
            href={`/${lang}/products`}
            className="inline-flex h-11 items-center rounded-full border border-ink/15 px-6 text-sm font-semibold text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
          >
            {t("nav.products")}
          </Link>
        </div>
      </div>
    </div>
  );
}
