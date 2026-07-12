"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Building2,
  Briefcase,
  Users,
  LogOut,
  Shield,
} from "lucide-react"
import { logoutAdmin } from "@/lib/api/admin"

const NAV = [
  { href: "/admin/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/etablissements", label: "Établissements", icon: Building2 },
  { href: "/admin/metiers", label: "Catalogue métiers", icon: Briefcase },
  { href: "/admin/utilisateurs", label: "Utilisateurs", icon: Users },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  function handleLogout() {
    logoutAdmin()
    router.replace("/admin/connexion")
  }

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-950 px-4 py-6 text-white md:flex">
      <div className="flex items-center gap-2 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFCB05] text-slate-900">
          <Shield className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold">To Be.Come</p>
          <p className="text-xs text-slate-400">Administration</p>
        </div>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname?.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active ? "bg-[#0F766E] text-white" : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          )
        })}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-4 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-slate-400 hover:bg-slate-900 hover:text-white"
      >
        <LogOut className="h-4 w-4" />
        Déconnexion
      </button>
    </aside>
  )
}
