import { etablissementsDB } from "@/lib/etablissement/data"

export function getDashboardStats() {
  const etablissements = etablissementsDB.getAll()

  const pending = etablissements.filter(e => e.status === "PENDING")
  const active = etablissements.filter(e => e.status === "ACTIVE")
  const rejected = etablissements.filter(e => e.status === "REJECTED")

  return {
    totalEleves: 0,
    totalParents: 1, // temporaire (comme tu as 1 parent)

    totalEtablissements: etablissements.length,
    etablissementsPending: pending.length,
    etablissementsActive: active.length,
    etablissementsRejected: rejected.length,

    missionCompletees: 0,
    riasecCompletees: 0,
    totalMetiers: 0,
    totalDomaines: 0,

    recentEtablissements: etablissements
      .slice()
      .reverse()
      .slice(0, 5)
      .map(e => ({
        id: e.id,
        nom: e.nomEtablissement,
        status: e.status,
        email: e.email,
        ville: e.ville
      }))
  }
}