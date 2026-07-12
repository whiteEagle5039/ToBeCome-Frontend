import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentEleve } from "@/lib/college/auth/session";

export async function GET() {
  const eleve = await getCurrentEleve();

  const metiers = await prisma.metier.findMany({
    orderBy: { nom: "asc" },
    include: { domaine: true },
  });

  let recommandations: string[] = [];
  if (eleve) {
    const profil = await prisma.riasecResultat.findUnique({ where: { eleveId: eleve.id } });
    if (profil && profil.typesPrincipaux.length > 0) {
      const [dominant, secondary] = profil.typesPrincipaux;
      const recos = await prisma.metier.findMany({
        where: { riasecTypes: { hasSome: [dominant, secondary].filter(Boolean) } },
        take: 3,
      });
      recommandations = recos.map((m) => m.slug);
    }
  }

  return NextResponse.json({ metiers, recommandations });
}
