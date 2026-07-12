import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentEleve } from "@/lib/college/auth/session";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; publicationId: string }> }
) {
  const eleve = await getCurrentEleve();
  if (!eleve) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { emoji } = await req.json();
  if (!emoji) {
    return NextResponse.json({ error: "Réaction manquante" }, { status: 400 });
  }

  const existante = await prisma.reaction.findUnique({
    where: {
      publicationId_auteurId: { publicationId: (await params).publicationId, auteurId: eleve.id },
    },
  });

  if (existante && existante.emoji === emoji) {
    // Même réaction cliquée à nouveau : on la retire
    await prisma.reaction.delete({ where: { id: existante.id } });
    return NextResponse.json({ reaction: null });
  }

  const reaction = await prisma.reaction.upsert({
    where: {
      publicationId_auteurId: { publicationId: (await params).publicationId, auteurId: eleve.id },
    },
    create: { publicationId: (await params).publicationId, auteurId: eleve.id, emoji },
    update: { emoji },
  });

  return NextResponse.json({ reaction });
}
