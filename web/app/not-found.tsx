// Global fallback 404 (used during static export generation). Sends the
// visitor to the default locale.

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GlobalNotFound() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/uz");
  }, [router]);
  return null;
}
