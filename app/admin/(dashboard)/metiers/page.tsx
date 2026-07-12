"use client"

import { useEffect, useState } from "react"
import { fetchAdminCatalogue } from "@/lib/api/admin"

interface DomaineItem {
  id: string
  nom: string
  description?: string | null
  metiers: Array<{ id: string; nom: string; slug: string }>
  _count?: { metiers: number }
}

export default function AdminMetiersPage() {
  const [domaines, setDomaines] = useState<DomaineItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminCatalogue()
      .then(setDomaines)
      .catch(() => setDomaines([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="px-6 py-8 md:px-10">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Catalogue métiers</h1>
        <p className="text-sm text-slate-500">Domaines et métiers de la plateforme</p>
      </header>

      {loading ? (
        <p className="text-sm text-slate-500">Chargement…</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {domaines.map((d) => (
            <div key={d.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-slate-900">{d.nom}</h2>
              <p className="mt-1 text-sm text-slate-500">{d.description}</p>
              <p className="mt-3 text-xs font-medium text-[#0F766E]">
                {d._count?.metiers ?? d.metiers.length} métier(s)
              </p>
              <ul className="mt-2 space-y-1">
                {d.metiers.slice(0, 5).map((m) => (
                  <li key={m.id} className="text-sm text-slate-600">• {m.nom}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
