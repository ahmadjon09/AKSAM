// Brand lockup using the client's logo file (/public/brand/logo.png, a
// transparent PNG). The logo always sits on a white plate so it stays
// legible over the dark hero, the dark footer and the white header alike.
// The red-square brand image (brand/icon.png) is used for the favicon and
// og-image fallback.

"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className="relative block rounded-full">
      <Image
        src="/brand/logo-red.png"
        alt="AKSAM"
        width={35}
        height={35}
        priority
        className="object-contain rounded"
      />
    </span>
  );
}
