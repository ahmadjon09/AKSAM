// Root page fallback: only used when middleware is unavailable (e.g. plain
// `next start`). Detects the saved locale and routes there.

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const saved = document.cookie.match(/aksam_lang=(uz|ru|en)/)?.[1];
    const browser = navigator.language.slice(0, 2).toLowerCase();
    const lang = saved ?? (["uz", "ru", "en"].includes(browser) ? browser : "uz");
    router.replace(`/${lang}`);
  }, [router]);

  return null;
}
