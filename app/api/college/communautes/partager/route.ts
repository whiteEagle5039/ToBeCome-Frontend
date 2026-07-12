import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentEleve } from "@/lib/college/auth/session";

/**
 * Publie une invitation dans une communauté dont l'élève est membre.
 * Utilisé pour inviter d'autres joueurs à un projet Studio (code d'accès)
 * ou à une Battle sur un métier.
 */
export async function POST(req: NextRequest) {
  const eleve = await getCurrentEleve();
  if (!eleve) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { communauteSlug, contenu } = await req.json();
  if (!communauteSlug || !contenu) {
    return NextResponse.json({ error: "Communauté et message requis" }, { status: 400 });
  }

  const communaute = await prisma.communaute.findUnique({ where: { slug: communauteSlug } });
  if (!communaute) {
    return NextResponse.json({ error: "Communauté introuvable" }, { status: 404 });
  }

  const membre = await prisma.communauteMembre.findUnique({
    where: { communauteId_eleveId: { communauteId: communaute.id, eleveId: eleve.id } },
  });
  if (!membre) {
    return NextResponse.json(
      { error: "Rejoins d'abord cette communauté pour y publier." },
      { status: 403 }
    );
  }

  const publication = await prisma.publication.create({
    data: { communauteId: communaute.id, auteurId: eleve.id, contenu },
  });

  return NextResponse.json({ publication, communaute: { slug: communaute.slug, nom: communaute.nom } });
}
