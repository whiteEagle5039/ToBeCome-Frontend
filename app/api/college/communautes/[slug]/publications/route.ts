import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentEleve } from "@/lib/college/auth/session";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const communaute = await prisma.communaute.findUnique({ where: { slug: (await params).slug } });
  if (!communaute) {
    return NextResponse.json({ error: "Communauté introuvable" }, { status: 404 });
  }

  const publications = await prisma.publication.findMany({
    where: { communauteId: communaute.id },
    orderBy: { createdAt: "desc" },
    include: {
      auteur: true,
      reponses: { include: { auteur: true }, orderBy: { createdAt: "asc" } },
      reactions: true,
    },
  });

  return NextResponse.json({ publications });
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

  const estMembre = await prisma.communauteMembre.findUnique({
    where: { communauteId_eleveId: { communauteId: communaute.id, eleveId: eleve.id } },
  });
  if (!estMembre) {
    return NextResponse.json({ error: "Rejoins la communauté pour publier." }, { status: 403 });
  }

  const { contenu, imageUrl, sondage } = await req.json();
  if (!contenu) {
    return NextResponse.json({ error: "Le message ne peut pas être vide." }, { status: 400 });
  }

  const publication = await prisma.publication.create({
    data: { communauteId: communaute.id, auteurId: eleve.id, contenu, imageUrl, sondage },
    include: { auteur: true },
  });

  return NextResponse.json({ publication });
}
