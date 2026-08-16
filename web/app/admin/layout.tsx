// Admin panel shell. Locale-free route (the panel has its own language
// switcher inside), fully client-side after the static shell.

import type { Metadata } from "next";
import { AdminProviders } from "@/components/admin/AdminProviders";

export const metadata: Metadata = {
  title: "Boshqaruv paneli — AKSAM",
  robots: { index: false, follow: false }
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminProviders>{children}</AdminProviders>;
}
