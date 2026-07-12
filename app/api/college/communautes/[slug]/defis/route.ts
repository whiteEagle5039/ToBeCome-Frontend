import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentEleve } from "@/lib/college/auth/session";
import { estModerateurOuPlus } from "@/lib/college/communautes/access";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const eleve = await getCurrentEleve();
  const communaute = await prisma.communaute.findUnique({ where: { slug: (await params).slug } });
  if (!communaute) {
    return NextResponse.json({ error: "Communauté introuvable" }, { status: 404 });
  }

  const defis = await prisma.defiCommunaute.findMany({
    where: { communauteId: communaute.id },
    orderBy: { createdAt: "desc" },
    include: {
      participations: eleve ? { where: { eleveId: eleve.id } } : false,
      _count: { select: { participations: true } },
    },
  });

  return NextResponse.json({ defis });
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
      { error: "Seuls les modérateurs peuvent lancer un défi." },
      { status: 403 }
    );
  }

  const { titre, description, xpRecompense, dateLimite } = await req.json();
  if (!titre || !description) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  const defi = await prisma.defiCommunaute.create({
    data: {
      communauteId: communaute.id,
      titre,
      description,
      xpRecompense: xpRecompense ?? 100,
      dateLimite: dateLimite ? new Date(dateLimite) : null,
    },
  });

  return NextResponse.json({ defi });
}
