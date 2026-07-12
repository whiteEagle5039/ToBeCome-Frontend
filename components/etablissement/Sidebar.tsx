"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  MessageCircleMore,
  BellRing,
  FileText,
  KeyRound,
  School,
  CreditCard,
  Settings,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/etablissement/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/etablissement/eleves", label: "Élèves", icon: Users },
  { href: "/etablissement/communication", label: "Communication", icon: MessageCircleMore },
  { href: "/etablissement/alertes", label: "Alertes", icon: BellRing },
  { href: "/etablissement/rapports", label: "Rapports", icon: FileText },
  { href: "/etablissement/matricules", label: "Matricules", icon: KeyRound },
  { href: "/etablissement/classes", label: "Classes", icon: School },
  { href: "/etablissement/abonnement", label: "Abonnement", icon: CreditCard },
  { href: "/etablissement/parametres", label: "Paramètres", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-100 bg-white px-4 py-6 md:flex">
      <div className="flex items-center gap-2 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0F766E] text-sm font-bold text-white">
          tb
        </div>
        <span className="text-sm font-semibold text-slate-800">
          To be.<span className="text-[#0F766E]">come</span>
        </span>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-[#0F766E]/10 text-[#0F766E]"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-400">
        Espace Établissement — v1.0
      </div>
    </aside>
  );
}
