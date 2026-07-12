import { NextResponse } from "next/server"
import { domaines, metiers } from "@/lib/metiers-data"

export async function GET() {
  const items = domaines.map((d) => {
    const metiersDuDomaine = metiers
      .filter((m) => m.domaineId === d.id)
      .map((m) => ({
        id: m.id,
        nom: m.titre,
        slug: m.id,
      }))

    return {
      id: d.id,
      nom: d.nom,
      description: d.description,
      metiers: metiersDuDomaine,
      _count: { metiers: metiersDuDomaine.length },
    }
  })

  return NextResponse.json(items)
}