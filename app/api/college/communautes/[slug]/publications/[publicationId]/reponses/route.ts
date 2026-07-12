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

  const { contenu } = await req.json();
  if (!contenu) {
    return NextResponse.json({ error: "La réponse ne peut pas être vide." }, { status: 400 });
  }

  const reponse = await prisma.reponse.create({
    data: { publicationId: (await params).publicationId, auteurId: eleve.id, contenu },
    include: { auteur: true },
  });

  return NextResponse.json({ reponse });
}
