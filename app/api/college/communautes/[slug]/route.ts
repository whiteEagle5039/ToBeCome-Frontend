import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentEleve } from "@/lib/college/auth/session";
import { getCommunauteEtAppartenance } from "@/lib/college/communautes/access";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const eleve = await getCurrentEleve();
  const { communaute, membre } = await getCommunauteEtAppartenance((await params).slug, eleve?.id);

  if (!communaute) {
    return NextResponse.json({ error: "Communauté introuvable" }, { status: 404 });
  }

  const [nbMembres, dernieresPublications, prochainEvenement, defisEnCours] = await Promise.all([
    prisma.communauteMembre.count({ where: { communauteId: communaute.id } }),
    prisma.publication.findMany({
      where: { communauteId: communaute.id },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: { auteur: true, _count: { select: { reponses: true, reactions: true } } },
    }),
    prisma.evenement.findFirst({
      where: { communauteId: communaute.id, dateDebut: { gte: new Date() } },
      orderBy: { dateDebut: "asc" },
    }),
    prisma.defiCommunaute.findMany({
      where: { communauteId: communaute.id },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  return NextResponse.json({
    communaute,
    membre,
    nbMembres,
    dernieresPublications,
    prochainEvenement,
    defisEnCours,
  });
}
