"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { Bell, LayoutGrid, LogOut, Menu, Settings, Compass, X } from "lucide-react";
import { useState } from "react";
import { Brand } from "./Brand";
import { TopBar } from "./TopBar";
import { ParentShellSkeleton } from "./ParentShellSkeleton";
import { useStore } from "@/lib/parent/store";

// Notifications n'apparaît plus ici : elle vit uniquement dans la cloche
// de la barre du haut (desktop) / du header mobile.
const NAV = [
  { href: "/parent/dashboard", label: "Mes enfants", icon: LayoutGrid },
  { href: "/parent/metiers", label: "Explorer", icon: Compass },
  { href: "/parent/parametres", label: "Paramètres", icon: Settings },
];

export function ParentShell({ children }: { children: ReactNode }) {
  const { isAuthenticated, hydrated, logout, notifications } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace("/parent/auth/login");
    }
  }, [hydrated, isAuthenticated, router]);

  const unread = notifications.filter((n) => !n.read).length;

  if (!hydrated) {
    return <ParentShellSkeleton />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Mobile top bar : marque, cloche notifications, menu */}
      <div className="flex items-center justify-between border-b border-line bg-white px-4 py-3 lg:hidden">
        <Brand />
        <div className="flex items-center gap-1">
          <Link
            href="/parent/notifications"
            aria-label="Notifications"
            className="focus-ring relative flex h-9 w-9 items-center justify-center rounded-lg text-teal-900"
          >
            <Bell size={20} />
            {unread > 0 ? (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-yellow-500" />
            ) : null}
          </Link>
          <button
            className="focus-ring rounded-lg p-2 text-teal-900"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Ouvrir le menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Menu mobile déroulant */}
      {mobileOpen ? (
        <nav className="space-y-1 border-b border-line bg-white px-4 py-3 lg:hidden">
          {NAV.map((item) => {
            const active = pathname?.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`focus-ring flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active ? "bg-teal-700 text-white" : "text-ink hover:bg-teal-50"
                }`}
              >
                <Icon size={18} />
                <span className="flex-1">{item.label}</span>
              </Link>
            );
          })}
          <button
            onClick={() => {
              logout();
              router.replace("/parent/auth/login");
            }}
            className="focus-ring flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate hover:bg-black/5"
          >
            <LogOut size={18} />
            Se déconnecter
          </button>
        </nav>
      ) : null}

      {/* Rail d'icônes flottant (desktop) */}
      <aside className="fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-1.5 rounded-full border border-line bg-white/95 p-2 shadow-lg backdrop-blur lg:flex">
        {NAV.map((item) => {
          const active = pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              aria-label={item.label}
              className={`focus-ring flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
                active ? "bg-teal-700 text-white" : "text-teal-900 hover:bg-teal-50"
              }`}
            >
              <Icon size={18} />
            </Link>
          );
        })}
        <div className="my-1 h-px w-6 bg-line" />
        <button
          onClick={() => {
            logout();
            router.replace("/parent/auth/login");
          }}
          title="Se déconnecter"
          aria-label="Se déconnecter"
          className="focus-ring flex h-11 w-11 items-center justify-center rounded-full text-slate hover:bg-black/5"
        >
          <LogOut size={18} />
        </button>
      </aside>

      {/* Barre du haut façon navigateur (desktop) — la cloche + popup notifications y vivent */}
      <TopBar />

      <main className="min-h-screen px-4 py-6 sm:px-8 sm:py-10 lg:pl-28 lg:pt-4">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}