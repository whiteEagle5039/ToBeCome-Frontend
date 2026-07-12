import { api, setToken, clearToken } from "./client"

export interface AdminDashboard {
  totalEleves: number
  totalParents: number
  totalEtablissements: number
  etablissementsPending: number
  missionCompletees: number
  riasecCompletees: number
  totalMetiers: number
  totalDomaines: number
  recentEtablissements: Array<{
    id: string
    nom: string
    status: string
    email?: string
    ville?: string
  }>
  timestamp: string
}

export interface AdminCatalogueItem {
  id: string
  nom: string
  description?: string | null
  metiers: Array<{ id: string; nom: string; slug: string }>
  _count?: { metiers: number }
}

/* ───────────────────────────── */
/* Auth admin                    */
/* ───────────────────────────── */

export async function loginAdmin(email: string, password: string) {
  const { data } = await api.post("/api/auth/login", {
    email,
    password,
    role: "ADMIN",
  })
  setToken("admin", data.token)
  return data
}

export function logoutAdmin(): void {
  clearToken("admin")
}

/* ───────────────────────────── */
/* Dashboard                     */
/* ───────────────────────────── */

export async function fetchAdminDashboard(): Promise<AdminDashboard> {
  const [statsRes, pendingRes, catalogueRes] = await Promise.all([
    api.get("/api/admin/stats"),
    api.get("/api/admin/etablissements", { params: { status: "PENDING" } }),
    api.get("/api/admin/metiers"),
  ])

  const stats = statsRes.data
  const pending: Array<{ id: string; nom: string; status: string; ville?: string; user?: { email?: string } }> =
    pendingRes.data
  const domaines: Array<{ metiers?: unknown[] }> = catalogueRes.data

  const totalMetiers = domaines.reduce((acc, d) => acc + (d.metiers?.length || 0), 0)

  return {
    totalEleves: stats.totalEleves,
    totalParents: stats.totalParents,
    totalEtablissements: stats.totalEtablissements,
    etablissementsPending: pending.length,
    missionCompletees: stats.missionCompletees,
    riasecCompletees: stats.riasecCompletees,
    totalMetiers,
    totalDomaines: domaines.length,
    recentEtablissements: pending.slice(0, 5).map((e) => ({
      id: e.id,
      nom: e.nom,
      status: e.status,
      email: e.user?.email,
      ville: e.ville,
    })),
    timestamp: stats.timestamp,
  }
}

/* ───────────────────────────── */
/* Établissements                */
/* ───────────────────────────── */

// Ces deux appels passent par les routes Next (mêmes domaine que l'app) :
// l'approbation y génère les identifiants de connexion et les envoie par
// e-mail à l'établissement (voir app/api/admin/etablissements/[id]/route.ts).
export async function fetchAdminEtablissements(status?: string) {
  const res = await fetch(
    `/api/admin/etablissements${status ? `?status=${status}` : ""}`,
    { cache: "no-store" }
  )
  if (!res.ok) throw new Error("Chargement des établissements impossible")
  return res.json()
}

export async function updateEtablissementStatus(
  id: string,
  status: string
): Promise<{ ok: boolean; emailEnvoye?: boolean; identifiants?: { email: string; motDePasse: string } }> {
  const res = await fetch(`/api/admin/etablissements/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  })
  if (!res.ok) throw new Error("Mise à jour du statut impossible")
  return res.json()
}

/* ───────────────────────────── */
/* Utilisateurs                  */
/* ───────────────────────────── */

export async function fetchAdminUsers(params?: { role?: string; q?: string; limit?: number }) {
  const { data } = await api.get("/api/admin/users", { params })
  return data
}

/* ───────────────────────────── */
/* Catalogue métiers              */
/* ───────────────────────────── */

export async function fetchAdminCatalogue(): Promise<AdminCatalogueItem[]> {
  const { data } = await api.get("/api/admin/metiers")
  return data
}