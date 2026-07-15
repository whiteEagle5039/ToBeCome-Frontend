import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { getCurrentEleve } from "@/lib/college/auth/session";
import { tirerQuestions } from "@/lib/college/quetes/battle";

/**
 * Mode asynchrone : le joueur affronte un « fantôme » — le score enregistré
 * d'un joueur ayant déjà terminé une Battle sur ce métier (ou un fantôme de
 * référence s'il n'y en a pas encore). La partie démarre immédiatement,
 * pas d'attente d'adversaire.
 */
export async function POST(req: NextRequest) {
  const eleve = await getCurrentEleve();
  if (!eleve) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { metierSlug } = await req.json();

  const metier = await prisma.metier.findUnique({ where: { slug: metierSlug } });
  if (!metier) {
    return NextResponse.json({ error: "Métier introuvable" }, { status: 404 });
  }

  // Meilleur score enregistré sur ce métier (hors soi-même, hors invités
  // sans compte qui n'ont pas de prénom à afficher) = le fantôme
  const meilleur = await prisma.battleParticipant.findFirst({
    where: {
      session: { metierId: metier.id, status: "TERMINEE" },
      tempsMs: { not: null },
      eleveId: { not: null },
      NOT: { eleveId: eleve.id },
    },
    orderBy: [{ score: "desc" }, { tempsMs: "asc" }],
    include: { eleve: { select: { prenom: true } } },
  });

  const ghost = meilleur
    ? {
        nom: `Fantôme de ${meilleur.eleve!.prenom}`,
        score: meilleur.score,
        tempsMs: meilleur.tempsMs ?? 90000,
      }
    : { nom: "Fantôme d'entraînement", score: 6, tempsMs: 90000 };

  const banque = await prisma.questionMetier.findMany({
    where: { metierId: metier.id, active: true },
  });

  const guestToken = randomBytes(24).toString("hex");

  const session = await prisma.battleSession.create({
    data: {
      metierId: metier.id,
      type: "DUEL",
      status: "EN_COURS",
      startedAt: new Date(),
      contenu: { questions: tirerQuestions(banque), ghost },
      participants: { create: { eleveId: eleve.id, hote: true, pret: true, guestToken } },
    },
    include: { participants: { include: { eleve: { select: { prenom: true, nom: true } } } } },
  });

  const contenu = session.contenu as { questions: unknown[]; ghost: typeof ghost };
  const moi = session.participants[0];

  return NextResponse.json({
    session: {
      id: session.id,
      type: session.type,
      status: session.status,
      questions: contenu.questions,
      ghost: contenu.ghost,
      participants: session.participants.map((p) => ({
        prenom: p.eleve!.prenom,
        nom: p.eleve!.nom,
        fini: false,
      })),
    },
    participantId: moi.id,
    guestToken,
  });
}
