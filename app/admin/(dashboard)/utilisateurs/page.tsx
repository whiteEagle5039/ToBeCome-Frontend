"use client"

import { useEffect, useState } from "react"
import { fetchAdminUsers } from "@/lib/api/admin"

interface UserItem {
  id: string
  email: string | null
  role: string
  createdAt: string
  eleveProfile?: { prenom: string; nom: string } | null
  parentProfile?: { prenom: string; nom: string } | null
  etablissementProfile?: { nom: string; status: string } | null
  adminProfile?: { prenom: string; nom: string } | null
}

const ROLES = ["", "ELEVE_COLLEGE", "ELEVE_LYCEE", "PARENT", "ETABLISSEMENT", "ADMIN"]

function displayName(u: UserItem) {
  if (u.eleveProfile) return `${u.eleveProfile.prenom} ${u.eleveProfile.nom}`
  if (u.parentProfile) return `${u.parentProfile.prenom} ${u.parentProfile.nom}`
  if (u.etablissementProfile) return u.etablissementProfile.nom
  if (u.adminProfile) return `${u.adminProfile.prenom} ${u.adminProfile.nom}`
  return "—"
}

export default function AdminUtilisateursPage() {
  const [users, setUsers] = useState<UserItem[]>([])
  const [role, setRole] = useState("")
  const [q, setQ] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchAdminUsers({ role: role || undefined, q: q || undefined })
      .then(setUsers)
      .catch(() => setUsers([]))
      .finally(() => setLoading(false))
  }, [role, q])

  return (
    <div className="px-6 py-8 md:px-10">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Utilisateurs</h1>
        <p className="text-sm text-slate-500">Tous les comptes de la plateforme</p>
      </header>

      <div className="mb-4 flex flex-wrap gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher par email…"
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>{r || "Tous les rôles"}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Chargement…</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3">Nom</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Rôle</th>
                <th className="px-4 py-3">Inscrit le</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{displayName(u)}</td>
                  <td className="px-4 py-3 text-slate-500">{u.email ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(u.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
