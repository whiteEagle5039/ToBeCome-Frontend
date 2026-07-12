import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentEleve } from "@/lib/college/auth/session";

function genererCodeAcces(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

/**
 * Liste des projets ouverts d'un métier : n'importe quel élève peut en
 * rejoindre un à tout moment (tant que le projet n'est pas finalisé).
 */
export async function GET(req: NextRequest) {
  const metierSlug = req.nextUrl.searchParams.get("metier");
  if (!metierSlug) {
    return NextResponse.json({ error: "Paramètre metier requis" }, { status: 400 });
  }

  const projets = await prisma.studioProject.findMany({
    where: { metier: { slug: metierSlug }, phase: { not: "FINALISATION" } },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      membres: { include: { eleve: { select: { prenom: true } } } },
    },
  });

  return NextResponse.json({
    projets: projets.map((p) => ({
      id: p.id,
      titre: p.titre,
      phase: p.phase,
      codeAcces: p.codeAcces,
      membres: p.membres.map((m) => ({ prenom: m.eleve.prenom, role: m.role })),
    })),
  });
}

// Créer un nouveau projet d'équipe
export async function POST(req: NextRequest) {
  const eleve = await getCurrentEleve();
  if (!eleve) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { metierSlug, titre, role } = await req.json();
  if (!titre || !role) {
    return NextResponse.json({ error: "Titre et rôle requis" }, { status: 400 });
  }

  const metier = await prisma.metier.findUnique({ where: { slug: metierSlug } });
  if (!metier) {
    return NextResponse.json({ error: "Métier introuvable" }, { status: 404 });
  }

  const project = await prisma.studioProject.create({
    data: {
      metierId: metier.id,
      titre,
      codeAcces: genererCodeAcces(),
      membres: { create: { eleveId: eleve.id, role } },
    },
    include: { membres: { include: { eleve: { select: { prenom: true, nom: true } } } } },
  });

  return NextResponse.json({ project });
}

// Rejoindre un projet existant via son code d'accès
export async function PATCH(req: NextRequest) {
  const eleve = await getCurrentEleve();
  if (!eleve) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { codeAcces, role } = await req.json();

  const project = await prisma.studioProject.findUnique({ where: { codeAcces } });
  if (!project) {
    return NextResponse.json({ error: "Code invalide" }, { status: 404 });
  }

  const existant = await prisma.studioMembership.findUnique({
    where: { projectId_eleveId: { projectId: project.id, eleveId: eleve.id } },
  });

  if (!existant) {
    await prisma.studioMembership.create({
      data: { projectId: project.id, eleveId: eleve.id, role },
    });
  }

  const updated = await prisma.studioProject.findUnique({
    where: { id: project.id },
    include: { membres: { include: { eleve: { select: { prenom: true, nom: true } } } } },
  });

  return NextResponse.json({ project: updated });
}
