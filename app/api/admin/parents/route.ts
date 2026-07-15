import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const parents = await prisma.parentProfile.findMany({
      orderBy: [{ nom: "asc" }, { prenom: "asc" }],
      include: {
        user: true,
        enfants: {
          include: {
            eleve: {
              include: {
                classe: true,
                etablissement: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(
      parents.map((parent) => ({
        id: parent.id,
        prenom: parent.prenom,
        nom: parent.nom,
        email: parent.user.email ?? "",
        telephone: parent.telephone ?? "",
        enfants: parent.enfants.map((relation) => ({
          id: relation.eleve.id,
          prenom: relation.eleve.prenom,
          nom: relation.eleve.nom,
          classeNom: relation.eleve.classe?.nom ?? "",
          etablissementNom: relation.eleve.etablissement?.nom ?? "",
        })),
      })),
    )
  } catch (error) {
    console.error("[admin/parents]", error)
    return NextResponse.json({ error: "Chargement des parents impossible" }, { status: 500 })
  }
}
