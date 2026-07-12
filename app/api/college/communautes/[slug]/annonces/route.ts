import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentEleve } from "@/lib/college/auth/session";
import { estModerateurOuPlus } from "@/lib/college/communautes/access";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const communaute = await prisma.communaute.findUnique({ where: { slug: (await params).slug } });
  if (!communaute) {
    return NextResponse.json({ error: "Communauté introuvable" }, { status: 404 });
  }

  const annonces = await prisma.annonce.findMany({
    where: { communauteId: communaute.id },
    orderBy: { createdAt: "desc" },
    include: { auteur: true },
  });

  return NextResponse.json({ annonces });
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
      { error: "Seuls les modérateurs peuvent publier une annonce." },
      { status: 403 }
    );
  }

  const { titre, contenu } = await req.json();
  if (!titre || !contenu) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  const annonce = await prisma.annonce.create({
    data: { communauteId: communaute.id, auteurId: eleve.id, titre, contenu },
    include: { auteur: true },
  });

  return NextResponse.json({ annonce });
}
