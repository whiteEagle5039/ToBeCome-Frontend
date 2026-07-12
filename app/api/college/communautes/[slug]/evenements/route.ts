import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentEleve } from "@/lib/college/auth/session";
import { estModerateurOuPlus } from "@/lib/college/communautes/access";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const communaute = await prisma.communaute.findUnique({ where: { slug: (await params).slug } });
  if (!communaute) {
    return NextResponse.json({ error: "Communauté introuvable" }, { status: 404 });
  }

  const evenements = await prisma.evenement.findMany({
    where: { communauteId: communaute.id },
    orderBy: { dateDebut: "asc" },
    include: { _count: { select: { participants: true } } },
  });

  return NextResponse.json({ evenements });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const eleve = await getCurrentEleve();
  if (!eleve) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const communaute = await prisma.communaute.findUnique({ where: { slug: (await params).slug } });
  if (!communaute) {
    return NextResponse.json({ error: "Communauté introuvable" }, { status: 404 });
  }

  const membre = await prisma.communauteMembre.findUnique({
    where: { communauteId_eleveId: { communauteId: communaute.id, eleveId: eleve.id } },
  });
  if (!estModerateurOuPlus(membre?.role)) {
    return NextResponse.json(
      { error: "Seuls les modérateurs peuvent créer un événement." },
      { status: 403 }
    );
  }

  const { titre, description, lieu, dateDebut, dateFin } = await req.json();
  if (!titre || !description || !dateDebut) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  const evenement = await prisma.evenement.create({
    data: {
      communauteId: communaute.id,
      titre,
      description,
      lieu,
      dateDebut: new Date(dateDebut),
      dateFin: dateFin ? new Date(dateFin) : null,
    },
  });

  return NextResponse.json({ evenement });
}
