"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Bell, ChevronLeft, ChevronRight, Plus, Search, UserRound } from "lucide-react";
import { useStore } from "@/lib/parent/store";
import { formatDateTime } from "@/lib/parent/utils";

const SEARCH_PLACEHOLDERS: Record<string, string> = {
  "/parent/dashboard": "Rechercher un enfant…",
  "/parent/metiers": "Rechercher un métier ou un domaine…",
};

function placeholderFor(pathname: string) {
  const match = Object.keys(SEARCH_PLACEHOLDERS).find((p) => pathname.startsWith(p));
  return match ? SEARCH_PLACEHOLDERS[match] : "Rechercher…";
}

/**
 * Barre du haut façon navigateur : flèches précédent/suivant, recherche
 * contextuelle centrale, puis les actions rapides à droite. La cloche
 * ouvre désormais un popup avec les notifications récentes au lieu de
 * naviguer directement vers la page.
 */
export function TopBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useStore();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [pathname, searchParams]);

  // Ferme le popup si on clique en dehors
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    if (notifOpen) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [notifOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const recent = [...notifications]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 5);

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    const base = pathname || "/parent/dashboard";
    router.push(q ? `${base}?q=${encodeURIComponent(q)}` : base);
  }

  return (
    <div className="sticky top-0 z-30 hidden bg-cream/80 px-4 pb-3 pt-4 backdrop-blur lg:block lg:pl-28">
      <div className="mx-auto flex max-w-4xl items-center gap-2 rounded-full border border-line bg-white px-2 py-2 shadow-sm">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Page précédente"
          className="focus-ring flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate hover:bg-teal-50 hover:text-teal-700"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          onClick={() => router.forward()}
          aria-label="Page suivante"
          className="focus-ring flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate hover:bg-teal-50 hover:text-teal-700"
        >
          <ChevronRight size={18} />
        </button>

        <form onSubmit={handleSearch} className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate"
            size={16}
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholderFor(pathname || "")}
            className="focus-ring w-full rounded-full border border-transparent bg-teal-50/60 py-2 pl-9 pr-3 text-sm text-ink placeholder:text-slate focus:border-teal-200 focus:bg-white"
          />
        </form>

        <button
          type="button"
          onClick={() => router.push("/parent/ajouter-enfant")}
          aria-label="Ajouter un enfant"
          title="Ajouter un enfant"
          className="focus-ring flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-700 text-white hover:bg-teal-800"
        >
          <Plus size={18} />
        </button>

        {/* Cloche + popup notifications */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotifOpen((v) => !v)}
            aria-label="Notifications"
            title="Notifications"
            className="focus-ring relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate hover:bg-teal-50 hover:text-teal-700"
          >
            <Bell size={17} />
            {unreadCount > 0 ? (
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-yellow-500" />
            ) : null}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full z-40 mt-2 w-80 overflow-hidden rounded-2xl border border-line bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-line px-4 py-3">
                <p className="text-sm font-semibold text-teal-950">Notifications</p>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllNotificationsRead()}
                    className="focus-ring text-xs font-medium text-teal-700 hover:underline"
                  >
                    Tout marquer comme lu
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {recent.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm text-slate">Rien à signaler.</p>
                ) : (
                  recent.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => {
                        if (!n.read) markNotificationRead(n.id);
                        setNotifOpen(false);
                        router.push("/parent/notifications");
                      }}
                      className={`focus-ring flex w-full items-start gap-2 border-b border-line px-4 py-3 text-left last:border-b-0 hover:bg-teal-50/60 ${
                        !n.read ? "bg-teal-50/40" : ""
                      }`}
                    >
                      <span
                        className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                          !n.read ? "bg-yellow-500" : "bg-transparent"
                        }`}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-teal-950">{n.title}</span>
                        <span className="block truncate text-xs text-slate">{n.message}</span>
                        <span className="mt-0.5 block text-[11px] text-slate">{formatDateTime(n.date)}</span>
                      </span>
                    </button>
                  ))
                )}
              </div>

              <Link
                href="/parent/notifications"
                onClick={() => setNotifOpen(false)}
                className="focus-ring block border-t border-line px-4 py-2.5 text-center text-xs font-semibold text-teal-700 hover:bg-teal-50"
              >
                Voir toutes les notifications
              </Link>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => router.push("/parent/parametres")}
          aria-label="Profil"
          title="Profil"
          className="focus-ring flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700"
        >
          <UserRound size={17} />
        </button>
      </div>
    </div>
  );
}