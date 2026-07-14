"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Bell, ChevronDown, LogOut, Settings } from "lucide-react";
import { logoutEtablissement } from "@/lib/api/auth";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export function TopBar({ title, subtitle }: TopBarProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleLogout() {
    logoutEtablissement();
    router.push("/etablissement/connexion");
  }

  return (
    <header className="flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4 md:px-8">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
        {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        <button
          aria-label="Notifications"
          className="relative rounded-full p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
        >
          <Bell className="h-5 w-5" strokeWidth={1.75} />
        </button>

        <div ref={menuRef} className="relative">
          <button
            type="button"
            aria-expanded={open}
            aria-haspopup="menu"
            onClick={() => setOpen((current) => !current)}
            className="flex items-center gap-2 rounded-full border border-slate-100 py-1.5 pl-1.5 pr-3 hover:bg-slate-50"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFCB05]/30 text-xs font-semibold text-[#8a6d00]">
              ÉT
            </div>
            <span className="text-sm font-medium text-slate-700">Mon établissement</span>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          {open ? (
            <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
              <Link
                href="/etablissement/parametres"
                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                onClick={() => setOpen(false)}
              >
                <Settings className="h-4 w-4" />
                Paramètre
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="h-4 w-4 text-rose-600" />
                Déconnexion
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
