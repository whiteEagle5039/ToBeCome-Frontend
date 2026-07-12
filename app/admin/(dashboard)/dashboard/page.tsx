"use client"

import { useEffect, useState } from "react"
import { Building2, GraduationCap, Users, Briefcase, ClipboardCheck } from "lucide-react"
import { fetchAdminDashboard, type AdminDashboard } from "@/lib/api/admin"

function StatCard({ label, value, icon: Icon }: { label: string; value: number | string; icon: typeof Users }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{label}</p>
        <Icon className="h-5 w-5 text-[#0F766E]" />
      </div>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  )
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboard | null>(null)

  useEffect(() => {
    fetchAdminDashboard().then(setData).catch(() => setData(null))
  }, [])

  return (
    <div className="px-6 py-8 md:px-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Tableau de bord admin</h1>
        <p className="mt-1 text-sm text-slate-500">Vue globale de la plateforme To Be.Come</p>
      </header>

      {!data ? (
        <p className="text-sm text-slate-500">Chargement…</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Élèves inscrits" value={data.totalEleves} icon={GraduationCap} />
            <StatCard label="Parents" value={data.totalParents} icon={Users} />
            <StatCard label="Établissements actifs" value={data.totalEtablissements} icon={Building2} />
            <StatCard label="En attente" value={data.etablissementsPending} icon={Building2} />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="RIASEC complétés" value={data.riasecCompletees} icon={ClipboardCheck} />
            <StatCard label="Missions validées" value={data.missionCompletees} icon={ClipboardCheck} />
            <StatCard label="Métiers" value={data.totalMetiers} icon={Briefcase} />
            <StatCard label="Domaines" value={data.totalDomaines} icon={Briefcase} />
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-800">Derniers établissements</h2>
            <ul className="mt-4 space-y-3">
              {data.recentEtablissements.map((e) => (
                <li key={e.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-slate-800">{e.nom}</p>
                    <p className="text-xs text-slate-400">{e.email}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    e.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" :
                    e.status === "PENDING" ? "bg-amber-100 text-amber-700" :
                    "bg-slate-100 text-slate-600"
                  }`}>
                    {e.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}