import { api } from "./client"
import type { BackendEleveRole } from "./client"
import type {
  Abonnement,
  Alerte,
  Classe,
  DashboardOverview,
  Eleve,
  EnvoiAcces,
  Matricule,
  ParametresEtablissement,
  Rapport,
} from "@/types/etablissement"
import {
  mapClasse,
  mapDashboard,
  mapEleveEtablissement,
  mapEtablissementParametres,
  mapMatricule,
  mapReports,
  mapSubscription,
  type BackendEleveProfile,
} from "./mappers"

export async function fetchDashboardOverview(): Promise<DashboardOverview> {
  const { data } = await api.get<{
    totalEleves: number
    elevesActifs: number
    elevesInactifs?: number
    progressionMoyenne: number
    metiersPopulaires?: Array<{ metierId?: string; nom?: string; domaine?: string; _count: number }>
    domainesTopExplores?: Array<{ nom: string; nbExplorations: number }>
  }>("/api/etablissement/dashboard")
  return mapDashboard(data)
}

export async function fetchEleves(): Promise<Eleve[]> {
  const { data } = await api.get<BackendEleveProfile[]>("/api/etablissement/eleves")
  return data.map(mapEleveEtablissement)
}

export async function fetchClasses(): Promise<Classe[]> {
  const { data } = await api.get<Array<{ id: string; nom: string; niveau: string; eleves?: unknown[] }>>(
    "/api/etablissement/classes",
  )
  return data.map(mapClasse)
}

export async function createClasse(payload: { nom: string; niveau: string; anneesScolaire?: string }) {
  const { data } = await api.post("/api/etablissement/classes", {
    nom: payload.nom,
    niveau: payload.niveau,
    anneesScolaire: payload.anneesScolaire ?? new Date().getFullYear().toString(),
  })
  return mapClasse(data)
}

export async function updateEtablissementStatus(id: string, status: string) {
  const { data } = await api.put(`/api/admin/etablissements/${id}`, {
    status,
  })

  return data
}

export async function deleteClasse(id: string) {
  await api.delete(`/api/etablissement/classes/${id}`)
}

export async function fetchMatricules(): Promise<Matricule[]> {
  const { data } = await api.get<Array<{ id: string; code: string; status: string; createdAt: string; eleveProfile?: { prenom: string; nom: string } | null }>>(
    "/api/etablissement/matricules",
  )
  return data.map(mapMatricule)
}

export async function generateMatricules(payload: { count: number }) {
  const { data } = await api.post<{ matricules: Array<{ code: string; id: string }> }>(
    "/api/etablissement/matricules",
    { count: payload.count },
  )
  return data.matricules.map((m) => ({
    id: m.id,
    code: m.code,
    statut: "non_utilise" as const,
    dateGeneration: new Date().toISOString(),
  }))
}

export async function fetchRapports(): Promise<Rapport[]> {
  const { data } = await api.get<Array<{ classe: string; totalEleves: number; elevesAvecRiasec: number }>>(
    "/api/etablissement/reports",
  )
  return mapReports(data)
}

export async function fetchAbonnement(): Promise<Abonnement | null> {
  const { data } = await api.get<Parameters<typeof mapSubscription>[0]>("/api/etablissement/subscription")
  return mapSubscription(data)
}

/** Souscrit ou change de formule — activation immédiate, facture générée. */
export async function souscrireAbonnement(
  formule: "decouverte" | "standard" | "etablissement_plus",
): Promise<Abonnement | null> {
  const planMap = {
    decouverte: "ESSENTIEL",
    standard: "STANDARD",
    etablissement_plus: "PREMIUM",
  } as const
  const { data } = await api.post<Parameters<typeof mapSubscription>[0]>(
    "/api/etablissement/subscription",
    { plan: planMap[formule] },
  )
  return mapSubscription(data)
}

export async function fetchParametres(): Promise<ParametresEtablissement> {
  const { data } = await api.get<Parameters<typeof mapEtablissementParametres>[0]>(
    "/api/etablissement/profile",
  )
  return mapEtablissementParametres(data)
}

export async function updateParametres(payload: Partial<ParametresEtablissement>) {
  const { data } = await api.put("/api/etablissement/profile", {
    nom: payload.nom,
    description: payload.description,
    logoUrl: payload.logoUrl,
    telephone: payload.telephone,
    email: payload.email,
    adresse: payload.adresse,
  })
  return mapEtablissementParametres(data)
}

export async function changeEtablissementPassword(current: string, newPassword: string) {
  await api.put("/api/etablissement/password", { currentPassword: current, newPassword })
}

/** Filières, résultats d'examens + publication de la page vitrine. */
export async function updatePagePublique(payload: {
  filieres?: string[]
  isPublished?: boolean
  resultatsExamens?: { examen: string; annee: string; tauxReussite: number }[]
}) {
  const { data } = await api.put("/api/etablissement/page-publique", payload)
  return data as { filieres: string[]; isPublished: boolean }
}

export async function fetchEnvoiHistorique(): Promise<EnvoiAcces[]> {
  const { data } = await api.get<EnvoiAcces[]>("/api/etablissement/communication/historique")
  return data
}

export async function sendAccesParents(payload: { eleveIds?: string[]; classeId?: string; canal: string }) {
  const { data } = await api.post<{ sent: number }>("/api/etablissement/communication/send", payload)
  return data
}

export async function fetchAlertes(): Promise<Alerte[]> {
  const { data } = await api.get<Alerte[]>("/api/etablissement/alertes")
  return data
}

export async function sendRappel(alerteId: string) {
  await api.post(`/api/etablissement/alertes/${alerteId}/rappel`)
}

export async function generateRapport(payload: { type: string; cibleId: string }): Promise<Rapport> {
  const { data } = await api.post<Rapport>("/api/etablissement/reports/generate", payload)
  return data
}

export async function shareRapportWhatsApp(rapportId: string, telephone: string) {
  const { data } = await api.post<{ waLink?: string }>(
    `/api/etablissement/reports/${rapportId}/whatsapp`,
    { telephone },
  )
  return data
}

export interface ImportElevePayload {
  prenom: string
  nom: string
  dateNaissance: string
  classeId: string
  role: BackendEleveRole
}

export type ImportEleveResult =
  | { success: true; matricule: string; userId: string }
  | { success: false; name?: string; error: string }

export interface ImportElevesResponse {
  imported: number
  results: ImportEleveResult[]
}

export async function importEleves(eleves: ImportElevePayload[]): Promise<ImportElevesResponse> {
  const { data } = await api.post<ImportElevesResponse>("/api/etablissement/eleves/import", { eleves })
  return data
}

export async function exportEleves(ids?: string[]) {
  const { data } = await api.get<{ rows: unknown[]; count: number }>("/api/etablissement/eleves/export", {
    params: ids?.length ? { ids: ids.join(",") } : undefined,
  })
  const blob = new Blob([JSON.stringify(data.rows, null, 2)], { type: "application/json" })
  return { url: URL.createObjectURL(blob), count: data.count }
}

export async function fetchEleve(id: string): Promise<Eleve | null> {
  try {
    const { data } = await api.get<BackendEleveProfile>(`/api/etablissement/eleves/${id}`)
    return mapEleveEtablissement(data)
  } catch {
    const eleves = await fetchEleves()
    return eleves.find((e) => e.id === id) ?? null
  }
}
