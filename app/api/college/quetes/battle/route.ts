import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentEleve } from "@/lib/college/auth/session";
import { tirerQuestions } from "@/lib/college/quetes/battle";

function serialiserSession(session: any, inclureQuestions: boolean) {
  const contenu = (session.contenu ?? {}) as any;
  return {
    id: session.id,
    type: session.type,
    status: session.status,
    ghost: contenu.ghost ?? null,
    questions: inclureQuestions ? contenu.questions ?? [] : undefined,
    participants: session.participants.map((p: any) => ({
      id: p.id,
      eleveId: p.eleveId,
      prenom: p.eleve?.prenom,
      nom: p.eleve?.nom,
      score: p.score,
      tempsMs: p.tempsMs,
      fini: p.tempsMs !== null,
      rang: p.rang,
    })),
  };
}

/**
 * Rejoindre la file d'attente d'une Battle (Duel = 2 joueurs, Royale = 5).
 * La session passe EN_COURS dès que la capacité est atteinte : les joueurs
 * reçoivent alors les mêmes questions et jouent chacun sur leur appareil
 * (synchronisation par interrogation régulière du serveur).
 */
export async function POST(req: NextRequest) {
  const eleve = await getCurrentEleve();
  if (!eleve) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { metierSlug, type } = await req.json();

  const metier = await prisma.metier.findUnique({ where: { slug: metierSlug } });
  if (!metier) {
    return NextResponse.json({ error: "Métier introuvable" }, { status: 404 });
  }

  let session = await prisma.battleSession.findFirst({
    where: { metierId: metier.id, type, status: "EN_ATTENTE" },
    include: { participants: { include: { eleve: { select: { prenom: true, nom: true } } } } },
  });

  if (!session) {
    const banque = await prisma.questionMetier.findMany({
      where: { metierId: metier.id, active: true },
    });
    session = await prisma.battleSession.create({
      data: { metierId: metier.id, type, contenu: { questions: tirerQuestions(banque) } },
      include: { participants: { include: { eleve: { select: { prenom: true, nom: true } } } } },
    });
  }

  const dejaInscrit = session.participants.some((p) => p.eleveId === eleve.id);
  if (!dejaInscrit) {
    await prisma.battleParticipant.create({
      data: { sessionId: session.id, eleveId: eleve.id },
    });
  }

  const capacite = type === "DUEL" ? 2 : 5;
  const nbInscrits = dejaInscrit ? session.participants.length : session.participants.length + 1;

  if (nbInscrits >= capacite && session.status === "EN_ATTENTE") {
    await prisma.battleSession.update({
      where: { id: session.id },
      data: { status: "EN_COURS", startedAt: new Date() },
    });
  }

  const fraiche = await prisma.battleSession.findUniqueOrThrow({
    where: { id: session.id },
    include: { participants: { include: { eleve: { select: { prenom: true, nom: true } } } } },
  });

  return NextResponse.json({ session: serialiserSession(fraiche, fraiche.status !== "EN_ATTENTE") });
}

/** État d'une session (utilisé en polling par les clients). */
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId");
  if (!sessionId) {
    return NextResponse.json({ error: "sessionId requis" }, { status: 400 });
  }

  const session = await prisma.battleSession.findUnique({
    where: { id: sessionId },
    include: { participants: { include: { eleve: { select: { prenom: true, nom: true } } } } },
  });

  if (!session) {
    return NextResponse.json({ error: "Session introuvable" }, { status: 404 });
  }

  return NextResponse.json({ session: serialiserSession(session, session.status !== "EN_ATTENTE") });
}
