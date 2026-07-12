import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentEleve } from "@/lib/college/auth/session";
import type { CommunauteType } from "@prisma/client";

export async function GET(req: NextRequest) {
  const eleve = await getCurrentEleve();
  const type = req.nextUrl.searchParams.get("type") as CommunauteType | null;

  const communautes = await prisma.communaute.findMany({
    where: type ? { type } : undefined,
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { membres: true } } },
  });

  let mesAdhesions: Set<string> = new Set();
  if (eleve) {
    const memberships = await prisma.communauteMembre.findMany({
      where: { eleveId: eleve.id },
      select: { communauteId: true },
    });
    mesAdhesions = new Set(memberships.map((m) => m.communauteId));
  }

  return NextResponse.json({
    communautes: communautes.map((c) => ({ ...c, estMembre: mesAdhesions.has(c.id) })),
  });
}

// Création d'une communauté privée (par un élève) — les autres types
// (Domaine, Métier, Club scolaire) sont typiquement créés par un
// établissement ou un administrateur via une interface dédiée, hors scope V1.
export async function POST(req: NextRequest) {
  const eleve = await getCurrentEleve();
  if (!eleve) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { nom, description, imageUrl } = await req.json();
  if (!nom || !description) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  const slug = nom
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const codeInvitation = Math.random().toString(36).slice(2, 8).toUpperCase();

  const communaute = await prisma.communaute.create({
    data: {
      type: "PRIVEE",
      nom,
      slug: `${slug}-${Math.random().toString(36).slice(2, 6)}`,
      description,
      imageUrl,
      estPrivee: true,
      codeInvitation,
      membres: {
        create: { eleveId: eleve.id, role: "ADMIN" },
      },
    },
  });

  return NextResponse.json({ communaute });
}
