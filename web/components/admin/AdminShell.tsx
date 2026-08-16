// Panel layout: dark sidebar with the nav, top bar with the user and the
// view-site link. The active nav item gets the red marker.

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, LayoutDashboard, LogOut, MapPin, Package, Settings, Tags, Users, Inbox } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Logo } from "@/components/ui/Logo";
import { Spinner } from "@/components/ui/Spinner";
import { useAuthStore } from "@/lib/store/auth";
import { cn } from "@/lib/utils";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [loggingOut, setLoggingOut] = useState(false);

  const items = [
    { key: "dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { key: "products", href: "/admin/products", icon: Package },
    { key: "categories", href: "/admin/categories", icon: Tags },
    { key: "leads", href: "/admin/leads", icon: Inbox },
    { key: "visitors", href: "/admin/visitors", icon: Users },
    { key: "settings", href: "/admin/settings", icon: Settings }
  ];

  const isActive = (href: string) => pathname.startsWith(href);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    window.location.href = "/admin/login";
  };

  return (
    <div className="flex min-h-screen bg-neutral-100">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 flex w-16 flex-col border-r border-white/8 bg-ink lg:w-60">
        <div className="flex h-16 items-center gap-3 border-b border-white/8 px-3 lg:px-5">
          <span className="shrink-0 scale-90">
            <Logo />
          </span>
          <span className="hidden text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40 lg:block">
            {t("nav.admin")}
          </span>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4 lg:px-3">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-2.5 py-2.5 text-sm font-medium transition-colors lg:px-3",
                  isActive(item.href) ? "bg-white/10 text-white" : "text-white/55 hover:bg-white/5 hover:text-white"
                )}
              >
                {isActive(item.href) && <span className="absolute -left-2 h-5 w-1 rounded-r bg-brand lg:-left-3" />}
                <Icon className="size-[18px] shrink-0" strokeWidth={1.9} />
                <span className="hidden lg:block">{t(`nav.${item.key}`)}</span>
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/8 p-2 lg:p-3">
          <Link
            href="/uz"
            className="flex items-center gap-3 rounded-lg px-2.5 py-2.5 text-sm font-medium text-white/55 transition-colors hover:bg-white/5 hover:text-white lg:px-3"
          >
            <ExternalLink className="size-[18px] shrink-0" strokeWidth={1.9} />
            <span className="hidden lg:block">{t("nav.viewSite")}</span>
          </Link>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col pl-16 lg:pl-60">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-ink/8 bg-white/85 px-5 backdrop-blur lg:px-8">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-ink">{t(`nav.${currentKey(pathname, items)}`)}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-[13px] font-semibold text-ink">{user?.fullName}</p>
              <p className="text-[11px] uppercase tracking-wide text-ink/40">{t(`roles.${user?.role}`)}</p>
            </div>
            <span className="grid size-9 place-items-center rounded-full bg-brand/10 text-[13px] font-bold text-brand">
              {(user?.fullName ?? "?").slice(0, 1).toUpperCase()}
            </span>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="grid size-9 place-items-center rounded-full border border-ink/10 text-ink/50 transition-colors hover:border-brand/40 hover:text-brand disabled:opacity-50"
              aria-label={t("nav.logout")}
            >
              {loggingOut ? <Spinner size="sm" tone="dark" /> : <LogOut className="size-4" />}
            </button>
          </div>
        </header>
        <main className="flex-1 p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

function currentKey(pathname: string, items: { key: string; href: string }[]): string {
  const match = items.find((i) => pathname.startsWith(i.href));
  return match?.key ?? "dashboard";
}
