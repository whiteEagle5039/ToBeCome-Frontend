import { NextResponse } from "next/server"
import { etablissementsDB } from "@/lib/etablissement/data"

export async function GET() {
  try {
    const etablissements = etablissementsDB.getAll()

    const pending = etablissements.filter(e => e.status === "PENDING")
    const active = etablissements.filter(e => e.status === "APPROVED")
    const rejected = etablissements.filter(e => e.status === "REJECTED")

    const data = {
      totalEleves: 0,
      totalParents: 1,

      totalEtablissements: etablissements.length,
      etablissementsPending: pending.length,

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
          email: e.email ?? "",
          ville: e.ville ?? ""
        })),

      timestamp: new Date().toISOString()
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: "Dashboard error" },
      { status: 500 }
    )
  }
}