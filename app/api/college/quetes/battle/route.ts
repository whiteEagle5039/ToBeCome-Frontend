import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentEleve } from "@/lib/college/auth/session";
import { nomParticipant } from "@/lib/college/quetes/battle-shared";

const INCLUDE = {
  metier: { select: { slug: true } },
  participants: { include: { eleve: { select: { prenom: true, nom: true } } } },
} as const;

type SessionAvecParticipants = Prisma.BattleSessionGetPayload<{ include: typeof INCLUDE }>;

function genererCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function genererGuestToken(): string {
  return randomBytes(24).toString("hex");
}

async function genererCodeUnique() {
  for (let i = 0; i < 5; i++) {
    const code = genererCode();
    const existe = await prisma.battleSession.findUnique({ where: { code } });
    if (!existe) return code;
  }
  throw new Error("Impossible de générer un code de salon unique");
}

function serialiserSession(session: SessionAvecParticipants) {
  return {
    id: session.id,
    code: session.code,
    type: session.type,
    status: session.status,
    metierSlug: session.metier.slug,
    participants: session.participants.map((p) => ({
      id: p.id,
      nom: nomParticipant(p),
      hote: p.hote,
      pret: p.pret,
      questionIndex: p.questionIndex,
      estInvite: !p.eleveId,
    })),
  };
}

/** Créer un nouveau salon Battle. L'hôte doit être un élève connecté. */
export async function POST(req: NextRequest) {
  const eleve = await getCurrentEleve();
  if (!eleve) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { metierSlug, type } = await req.json();
  if (!metierSlug || (type !== "DUEL" && type !== "BATTLE_ROYALE")) {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
  }

  const metier = await prisma.metier.findUnique({ where: { slug: metierSlug } });
  if (!metier) {
    return NextResponse.json({ error: "Métier introuvable" }, { status: 404 });
  }

  const code = await genererCodeUnique();
  const guestToken = genererGuestToken();

  const session = await prisma.battleSession.create({
    data: {
      metierId: metier.id,
      type,
      code,
      participants: { create: { eleveId: eleve.id, hote: true, pret: true, guestToken } },
    },
    include: INCLUDE,
  });

  const hote = session.participants.find((p) => p.eleveId === eleve.id)!;

  return NextResponse.json({
    session: serialiserSession(session),
    participantId: hote.id,
    guestToken,
  });
}

/**
 * Rejoindre un salon existant via son code d'invitation — élève connecté ou
 * invité muni d'un simple pseudo. La vérification de capacité se fait en
 * transaction sérialisable pour éviter que deux invités ne prennent tous les
 * deux la dernière place d'une même partie.
 */
export async function PATCH(req: NextRequest) {
  const { code, guestNom } = await req.json();
  if (!code) {
    return NextResponse.json({ error: "Code requis" }, { status: 400 });
  }

  const eleve = await getCurrentEleve();
  if (!eleve && !guestNom?.trim()) {
    return NextResponse.json({ error: "Un pseudo est requis pour rejoindre en invité" }, { status: 400 });
  }

  const executerAdhesion = () =>
    prisma.$transaction(
      async (tx) => {
        const session = await tx.battleSession.findUnique({
          where: { code: String(code).toUpperCase() },
          include: INCLUDE,
        });
        if (!session) throw new Error("CODE_INTROUVABLE");
        if (session.status !== "EN_ATTENTE") throw new Error("PARTIE_DEJA_LANCEE");

        const dejaInscrit = eleve ? session.participants.find((p) => p.eleveId === eleve.id) : undefined;
        if (dejaInscrit) {
          return { session, participant: dejaInscrit, guestToken: dejaInscrit.guestToken! };
        }

        const capacite = session.type === "DUEL" ? 2 : 5;
        if (session.participants.length >= capacite) {
          throw new Error("SALON_COMPLET");
        }

        const guestToken = genererGuestToken();
        const participant = await tx.battleParticipant.create({
          data: eleve
            ? { sessionId: session.id, eleveId: eleve.id, guestToken }
            : { sessionId: session.id, guestNom: String(guestNom).trim().slice(0, 40), guestToken },
          include: { eleve: { select: { prenom: true, nom: true } } },
        });

        const fraiche = await tx.battleSession.findUniqueOrThrow({
          where: { id: session.id },
          include: INCLUDE,
        });

        return { session: fraiche, participant, guestToken };
      },
      // Timeout généreux : connexions Neon serverless (reprise à froid possible).
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable, timeout: 15000 }
    );

  try {
    let resultat;
    for (let tentative = 0; ; tentative++) {
      try {
        resultat = await executerAdhesion();
        break;
      } catch (err) {
        const estConflitSerialisation =
          err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2034";
        if (estConflitSerialisation && tentative < 2) continue;
        throw err;
      }
    }

    return NextResponse.json({
      session: serialiserSession(resultat.session),
      participantId: resultat.participant.id,
      guestToken: resultat.guestToken,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur";
    if (message === "CODE_INTROUVABLE") {
      return NextResponse.json({ error: "Code invalide" }, { status: 404 });
    }
    if (message === "PARTIE_DEJA_LANCEE") {
      return NextResponse.json({ error: "Cette partie a déjà démarré" }, { status: 409 });
    }
    if (message === "SALON_COMPLET") {
      return NextResponse.json({ error: "Le salon est complet" }, { status: 409 });
    }
    console.error("[battle:PATCH]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

/** État d'un salon (premier rendu avant connexion socket), par sessionId ou code. */
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId");
  const code = req.nextUrl.searchParams.get("code");
  if (!sessionId && !code) {
    return NextResponse.json({ error: "sessionId ou code requis" }, { status: 400 });
  }

  const session = await prisma.battleSession.findUnique({
    where: sessionId ? { id: sessionId } : { code: code!.toUpperCase() },
    include: INCLUDE,
  });

  if (!session) {
    return NextResponse.json({ error: "Salon introuvable" }, { status: 404 });
  }

  const contenu = (session.contenu ?? {}) as { questions?: unknown[] };

  return NextResponse.json({
    session: serialiserSession(session),
    questions: session.status !== "EN_ATTENTE" ? contenu.questions ?? [] : undefined,
  });
}
