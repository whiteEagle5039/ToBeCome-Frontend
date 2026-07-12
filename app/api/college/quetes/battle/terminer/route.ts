import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentEleve } from "@/lib/college/auth/session";

const XP_VAINQUEUR = 200;
const XP_PARTICIPANT = 50;

/**
 * Un joueur termine sa série de questions : on enregistre score + temps.
 * Quand tous les participants ont fini (ou que le fantôme est battu/vainqueur),
 * la session passe TERMINEE, le classement est calculé (score décroissant,
 * temps croissant) et l'XP est créditée.
 */
export async function POST(req: NextRequest) {
  const eleve = await getCurrentEleve();
  if (!eleve) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { sessionId, score, tempsMs } = await req.json();

  const session = await prisma.battleSession.findUnique({
    where: { id: sessionId },
    include: { participants: true },
  });
  if (!session) {
    return NextResponse.json({ error: "Session introuvable" }, { status: 404 });
  }

  const moi = session.participants.find((p) => p.eleveId === eleve.id);
  if (!moi) {
    return NextResponse.json({ error: "Tu ne participes pas à cette session" }, { status: 403 });
  }

  if (moi.tempsMs === null) {
    await prisma.battleParticipant.update({
      where: { id: moi.id },
      data: { score: score ?? 0, tempsMs: tempsMs ?? 0 },
    });
  }

  const participants = await prisma.battleParticipant.findMany({
    where: { sessionId: session.id },
    include: { eleve: { select: { prenom: true, nom: true } } },
  });

  const contenu = (session.contenu ?? {}) as { ghost?: { nom: string; score: number; tempsMs: number } };
  const tousFinis = participants.every((p) => p.tempsMs !== null);

  if (tousFinis && session.status !== "TERMINEE") {
    // Classement : les vrais joueurs + éventuellement le fantôme
    const classement: { participantId: string | null; nom: string; score: number; tempsMs: number }[] =
      participants.map((p) => ({
        participantId: p.id,
        nom: `${p.eleve.prenom} ${p.eleve.nom}`,
        score: p.score,
        tempsMs: p.tempsMs ?? 0,
      }));
    if (contenu.ghost) {
      classement.push({ participantId: null, ...contenu.ghost });
    }
    classement.sort((a, b) => b.score - a.score || a.tempsMs - b.tempsMs);

    await prisma.battleSession.update({
      where: { id: session.id },
      data: { status: "TERMINEE", endedAt: new Date() },
    });

    for (let i = 0; i < classement.length; i++) {
      const c = classement[i];
      if (!c.participantId) continue;
      const participant = participants.find((p) => p.id === c.participantId)!;
      await prisma.battleParticipant.update({
        where: { id: c.participantId },
        data: { rang: i + 1, elimine: i > 0 },
      });
      const xp = i === 0 ? XP_VAINQUEUR : XP_PARTICIPANT;
      await prisma.$transaction([
        prisma.xpHistorique.create({
          data: {
            eleveId: participant.eleveId,
            points: xp,
            raison: i === 0 ? "Battle gagnée" : "Battle disputée",
          },
        }),
        prisma.eleveProfile.update({
          where: { id: participant.eleveId },
          data: { xpTotal: { increment: xp } },
        }),
      ]);
    }
  }

  const finale = await prisma.battleSession.findUniqueOrThrow({
    where: { id: session.id },
    include: { participants: { include: { eleve: { select: { prenom: true, nom: true } } } } },
  });

  const classementFinal =
    finale.status === "TERMINEE"
      ? [
          ...finale.participants.map((p) => ({
            nom: `${p.eleve.prenom} ${p.eleve.nom}`,
            score: p.score,
            tempsMs: p.tempsMs ?? 0,
            moi: p.eleveId === eleve.id,
            fantome: false,
          })),
          ...(contenu.ghost
            ? [{ nom: contenu.ghost.nom, score: contenu.ghost.score, tempsMs: contenu.ghost.tempsMs, moi: false, fantome: true }]
            : []),
        ].sort((a, b) => b.score - a.score || a.tempsMs - b.tempsMs)
      : null;

  return NextResponse.json({
    status: finale.status,
    classement: classementFinal,
    xpGagne:
      finale.status === "TERMINEE" && classementFinal
        ? classementFinal.findIndex((c) => c.moi) === 0
          ? XP_VAINQUEUR
          : XP_PARTICIPANT
        : 0,
  });
}
