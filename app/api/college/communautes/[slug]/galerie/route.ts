import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentEleve } from "@/lib/college/auth/session";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const communaute = await prisma.communaute.findUnique({ where: { slug: (await params).slug } });
  if (!communaute) {
    return NextResponse.json({ error: "Communauté introuvable" }, { status: 404 });
  }

  const photos = await prisma.photoGalerie.findMany({
    where: { communauteId: communaute.id },
    orderBy: { createdAt: "desc" },
    include: { auteur: true },
  });

  return NextResponse.json({ photos });
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
    return NextResponse.json({ error: "Rejoins la communauté pour publier une photo." }, { status: 403 });
  }

  const { imageUrl, legende } = await req.json();
  if (!imageUrl) {
    return NextResponse.json({ error: "Image manquante" }, { status: 400 });
  }

  const photo = await prisma.photoGalerie.create({
    data: { communauteId: communaute.id, auteurId: eleve.id, imageUrl, legende },
    include: { auteur: true },
  });

  return NextResponse.json({ photo });
}
