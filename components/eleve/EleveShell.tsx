"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ReactNode, useEffect, useState } from "react"
import {
  Bell,
  Compass,
  LayoutGrid,
  LogOut,
  Menu,
  Rocket,
  Settings,
  Target,
  X,
} from "lucide-react"
import { useEleveStore } from "@/lib/eleve/store"
import { getIcon } from "@/lib/parent/icons"

const NAV = [
  { href: "/eleve/dashboard", label: "Accueil", icon: LayoutGrid },
  { href: "/eleve/metiers", label: "Métiers", icon: Compass },
  { href: "/eleve/missions", label: "Missions", icon: Target },
  { href: "/eleve/progression", label: "Progression", icon: Rocket },
  { href: "/eleve/notifications", label: "Notifications", icon: Bell },
  { href: "/eleve/parametres", label: "Paramètres", icon: Settings },
]

export function EleveShell({ children }: { children: ReactNode }) {
  const { isAuthenticated, hydrated, logout, notifications, profile, loading } = useEleveStore()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace("/eleve/connexion")
    }
  }, [hydrated, isAuthenticated, router])

  const unread = notifications.filter((n) => !n.read).length
  const isLudique = profile?.niveau === "collegien"
  const AvatarIcon = profile ? getIcon(profile.avatarIcon) : LayoutGrid

  if (!hydrated || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#DFF6F3]">
        <p className="text-sm text-[#0F766E]">Chargement de ton espace…</p>
      </div>
    )
  }

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-[#DFF6F3] lg:flex">
      <div className="flex items-center justify-between border-b border-[#FFCB05]/40 bg-white px-4 py-3 lg:hidden">
        <Link href="/eleve/dashboard" className="flex items-center gap-2">
          <span className="text-lg font-bold text-[#0F766E]">To Be.Come</span>
        </Link>
        <button
          className="rounded-lg p-2 text-[#0F766E]"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <aside
        className={`${
          mobileOpen ? "block" : "hidden"
        } w-full border-b border-[#FFCB05]/40 bg-white lg:block lg:w-72 lg:shrink-0 lg:border-b-0 lg:border-r lg:min-h-screen`}
      >
        <div className="flex h-full flex-col justify-between px-5 py-6">
          <div>
            <div className="hidden px-2 pb-6 lg:block">
              <Link href="/eleve/dashboard" className="text-xl font-bold text-[#0F766E]">
                To Be.Come
              </Link>
              <p className="mt-1 text-xs text-black/60">
                {isLudique ? "🚀 Explore ton futur !" : "Ton parcours d'orientation"}
              </p>
            </div>
            <nav className="space-y-1">
              {NAV.map((item) => {
                const active = pathname?.startsWith(item.href)
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-[#FFCB05] text-black"
                        : "text-black/70 hover:bg-[#DFF6F3]"
                    }`}
                  >
                    <Icon size={18} />
                    <span className="flex-1">{item.label}</span>
                    {item.href === "/eleve/notifications" && unread > 0 ? (
                      <span className="rounded-full bg-[#0F766E] px-1.5 py-0.5 text-[11px] font-bold text-white">
                        {unread}
                      </span>
                    ) : null}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="mt-8 border-t border-[#FFCB05]/30 pt-4">
            <div className="mb-3 flex items-center gap-3 px-2">
              <span className="flex size-10 items-center justify-center rounded-full bg-[#0F766E]/10 text-[#0F766E]">
                <AvatarIcon size={20} />
              </span>
              <div>
                <p className="text-sm font-semibold text-black">
                  {profile?.firstName} {profile?.lastName}
                </p>
                <p className="text-xs text-black/50">{profile?.className}</p>
              </div>
            </div>
            <button
              onClick={() => {
                logout()
                router.replace("/eleve/connexion")
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-black/60 hover:bg-black/5"
            >
              <LogOut size={18} />
              Se déconnecter
            </button>
          </div>
        </div>
      </aside>

      <main className="min-h-screen flex-1 px-4 py-6 sm:px-8 sm:py-10">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  )
}
