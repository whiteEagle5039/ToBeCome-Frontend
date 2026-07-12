"use client"

import { useEffect, useState } from "react"
import { fetchAdminEtablissements, updateEtablissementStatus } from "@/lib/api/admin"

interface EtabItem {
  id: string
  nom: string
  status: string
  ville?: string | null
  user?: { email: string | null }
  _count?: { eleveProfiles: number }
}

export default function AdminEtablissementsPage() {
  const [items, setItems] = useState<EtabItem[]>([])
  const [filter, setFilter] = useState("PENDING")
  const [loading, setLoading] = useState(true)
  const [identifiants, setIdentifiants] = useState<{
    nom: string
    email?: string
    motDePasse?: string
    emailEnvoye: boolean
  } | null>(null)

  async function load() {
    setLoading(true)
    try {
      const data = await fetchAdminEtablissements(filter)
      console.log("Données reçues pour le filtre", filter, ":", data)
      setItems(data)
    } catch (err) {
      console.error("Erreur fetch etablissements:", err)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [filter])

  async function handleStatus(id: string, status: string, nom?: string) {
    const res = await updateEtablissementStatus(id, status)
    // À l'approbation : identifiants générés — envoyés par e-mail, ou affichés
    // ici pour transmission manuelle si le SMTP n'est pas configuré.
    if (status === "ACTIVE") {
      setIdentifiants({
        nom: nom ?? "",
        email: res.identifiants?.email,
        motDePasse: res.identifiants?.motDePasse,
        emailEnvoye: !!res.emailEnvoye,
      })
    }
    load()
  }

  return (
    <div className="px-6 py-8 md:px-10">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Établissements</h1>
        <p className="text-sm text-slate-500">Approuver, activer ou suspendre les établissements</p>
      </header>

      <div className="mb-4 flex gap-2">
        {["PENDING", "ACTIVE", "SUSPENDED", "REJECTED"].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              filter === s ? "bg-[#0F766E] text-white" : "bg-white text-slate-600 ring-1 ring-slate-200"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {identifiants && (
        <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="font-semibold text-emerald-900">
            {identifiants.nom} approuvé.
          </p>
          {identifiants.emailEnvoye ? (
            <p className="mt-1 text-sm text-emerald-800">
              Les identifiants de connexion ont été envoyés par e-mail à l'établissement.
            </p>
          ) : (
            <div className="mt-1 text-sm text-emerald-800">
              <p>
                E-mail non configuré — transmettez ces identifiants à l'établissement
                (il pourra changer son mot de passe après connexion) :
              </p>
              <p className="mt-2 rounded-lg bg-white px-3 py-2 font-mono text-emerald-900">
                {identifiants.email} · {identifiants.motDePasse}
              </p>
            </div>
          )}
          <button
            type="button"
            onClick={() => setIdentifiants(null)}
            className="mt-3 text-sm font-medium text-emerald-700 underline"
          >
            Fermer
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-slate-500">Chargement…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-slate-500">Aucun établissement dans ce statut.</p>
      ) : (
        <div className="space-y-3">
          {items.map((e) => (
            <div key={e.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div>
                <p className="font-semibold text-slate-900">{e.nom}</p>
                <p className="text-sm text-slate-500">{e.user?.email} · {e.ville ?? "—"} · {e._count?.eleveProfiles ?? 0} élèves</p>
              </div>
              <div className="flex gap-2">
                {e.status === "PENDING" && (
                  <>
                    <button type="button" onClick={() => handleStatus(e.id, "ACTIVE", e.nom)} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm text-white">
                      Approuver
                    </button>
                    <button type="button" onClick={() => handleStatus(e.id, "REJECTED")} className="rounded-lg bg-red-600 px-3 py-1.5 text-sm text-white">
                      Rejeter
                    </button>
                  </>
                )}
                {e.status === "ACTIVE" && (
                  <button type="button" onClick={() => handleStatus(e.id, "SUSPENDED")} className="rounded-lg bg-amber-500 px-3 py-1.5 text-sm text-white">
                    Suspendre
                  </button>
                )}
                {e.status === "SUSPENDED" && (
                  <button type="button" onClick={() => handleStatus(e.id, "ACTIVE")} className="rounded-lg bg-[#0F766E] px-3 py-1.5 text-sm text-white">
                    Réactiver
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}