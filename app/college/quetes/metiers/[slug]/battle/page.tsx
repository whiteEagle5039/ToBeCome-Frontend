"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BackButton } from "@/components/college/BackButton";
import { BattleRoom } from "@/components/college/quetes/BattleRoom";
import type { SessionInfo, Question } from "@/components/college/quetes/useBattleRoom";

type BattleType = "DUEL" | "BATTLE_ROYALE";
const SECONDES_PAR_QUESTION = 15;

type Salon = { session: SessionInfo; participantId: string; guestToken: string; nomMoi: string };
type Fantome = { session: any; participantId: string; guestToken: string };

/**
 * Point d'entrée « créateur » du mode Battle : choix du format, création du
 * salon (l'hôte doit être un élève connecté), puis bascule sur le salon
 * temps réel partagé (BattleRoom). Le mode fantôme reste asynchrone et
 * solo, sans salon ni temps réel.
 */
export default function BattlePage() {
  const params = useParams<{ slug: string }>();
  const [salon, setSalon] = useState<Salon | null>(null);
  const [fantome, setFantome] = useState<Fantome | null>(null);
  const [chargement, setChargement] = useState<BattleType | "FANTOME" | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  const creerSalon = async (type: BattleType) => {
    setChargement(type);
    setErreur(null);
    const res = await fetch("/api/college/quetes/battle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ metierSlug: params.slug, type }),
    });
    const data = await res.json();
    setChargement(null);
    if (!res.ok) {
      setErreur(data.error ?? "Impossible de créer le salon.");
      return;
    }
    const moi = data.session.participants.find((p: { id: string }) => p.id === data.participantId);
    setSalon({
      session: data.session,
      participantId: data.participantId,
      guestToken: data.guestToken,
      nomMoi: moi?.nom ?? "Toi",
    });
  };

  const jouerFantome = async () => {
    setChargement("FANTOME");
    setErreur(null);
    const res = await fetch("/api/college/quetes/battle/fantome", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ metierSlug: params.slug }),
    });
    const data = await res.json();
    setChargement(null);
    if (!res.ok) {
      setErreur(data.error ?? "Impossible de lancer le mode fantôme.");
      return;
    }
    setFantome(data);
  };

  if (fantome) {
    return <ModeFantome data={fantome} retourHref={`/college/quetes/metiers/${params.slug}/battle`} />;
  }

  if (salon) {
    return (
      <BattleRoom
        session={salon.session}
        participantId={salon.participantId}
        guestToken={salon.guestToken}
        nomMoi={salon.nomMoi}
        retourHref={`/college/quetes/metiers/${params.slug}/battle`}
      />
    );
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-10">
      <BackButton href={`/college/quetes/metiers/${params.slug}`} />
      <p className="text-xs uppercase tracking-wide text-espace-muted">Mode Battle</p>
      <h1 className="mt-1 text-2xl font-bold text-espace-ink">Choisis ton format</h1>

      {erreur && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erreur}</p>}

      <div className="mt-6 flex flex-col gap-3">
        <button
          onClick={() => creerSalon("DUEL")}
          disabled={!!chargement}
          className="rounded-lg border border-espace-border bg-white p-4 text-left transition hover:border-espace-primary disabled:opacity-50"
        >
          <p className="font-semibold text-espace-ink">Duel 1 vs 1 — temps réel</p>
          <p className="mt-1 text-sm text-espace-muted">
            Crée un salon, partage le lien d'invitation, et lance dès que ton adversaire est prêt.
          </p>
        </button>
        <button
          onClick={() => creerSalon("BATTLE_ROYALE")}
          disabled={!!chargement}
          className="rounded-lg border border-espace-border bg-white p-4 text-left transition hover:border-espace-primary disabled:opacity-50"
        >
          <p className="font-semibold text-espace-ink">Battle Royale — jusqu'à 5 joueurs</p>
          <p className="mt-1 text-sm text-espace-muted">
            Invite qui tu veux par lien — même sans compte. Lance dès que vous êtes prêts.
          </p>
        </button>
        <button
          onClick={jouerFantome}
          disabled={!!chargement}
          className="rounded-lg border border-espace-border bg-white p-4 text-left transition hover:border-espace-primary disabled:opacity-50"
        >
          <p className="font-semibold text-espace-ink">Contre un fantôme — asynchrone</p>
          <p className="mt-1 text-sm text-espace-muted">
            Joue immédiatement contre le meilleur score enregistré ; le vainqueur est annoncé à la fin.
          </p>
        </button>
      </div>
    </main>
  );
}

/** Mode fantôme : partie solo asynchrone, sans salon ni temps réel. */
function ModeFantome({ data, retourHref }: { data: Fantome; retourHref: string }) {
  const questions: Question[] = data.session.questions;
  const ghost = data.session.ghost as { nom: string; score: number } | null;

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [chrono, setChrono] = useState(SECONDES_PAR_QUESTION);
  const [debutJeu] = useState(() => Date.now());
  const [phase, setPhase] = useState<"jeu" | "resultat">("jeu");
  const [classement, setClassement] = useState<
    { nom: string; score: number; tempsMs: number; moi: boolean; fantome: boolean }[] | null
  >(null);
  const [xpGagne, setXpGagne] = useState(0);

  const terminer = useCallback(
    async (scoreFinal: number) => {
      const res = await fetch("/api/college/quetes/battle/terminer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: data.session.id,
          participantId: data.participantId,
          guestToken: data.guestToken,
          score: scoreFinal,
          tempsMs: Date.now() - debutJeu,
        }),
      });
      const resultat = await res.json();
      setClassement(resultat.classement);
      setXpGagne(resultat.xpGagne);
      setPhase("resultat");
    },
    [data, debutJeu]
  );

  const repondre = useCallback(
    (correct: boolean) => {
      const nouveauScore = score + (correct ? 1 : 0);
      setScore(nouveauScore);
      if (index + 1 >= questions.length) {
        void terminer(nouveauScore);
      } else {
        setIndex(index + 1);
        setChrono(SECONDES_PAR_QUESTION);
      }
    },
    [score, index, questions.length, terminer]
  );

  useEffect(() => {
    if (phase !== "jeu") return;
    if (chrono <= 0) {
      repondre(false);
      return;
    }
    const t = setTimeout(() => setChrono((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, chrono, repondre]);

  if (phase === "jeu" && questions[index]) {
    const q = questions[index];
    return (
      <main className="mx-auto max-w-xl px-6 py-10">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-wide text-espace-muted">
            Battle — question {index + 1} / {questions.length}
          </p>
          <span
            className={`rounded-full px-3 py-1 text-sm font-bold ${
              chrono <= 5 ? "bg-red-100 text-red-700" : "bg-espace-surface text-espace-primary"
            }`}
          >
            {chrono}s
          </span>
        </div>
        {ghost && (
          <p className="mt-1 text-xs text-espace-muted">
            Adversaire : {ghost.nom} — {ghost.score}/{questions.length}
          </p>
        )}
        <div className="mt-3 h-1.5 w-full rounded-full bg-espace-border">
          <div
            className="h-full rounded-full bg-espace-accent transition-all duration-1000 ease-linear"
            style={{ width: `${(chrono / SECONDES_PAR_QUESTION) * 100}%` }}
          />
        </div>

        <p className="mt-6 text-lg font-semibold text-espace-ink">{q.question}</p>
        <div className="mt-4 flex flex-col gap-2">
          {q.choix.map((choix, i) => (
            <button
              key={i}
              onClick={() => repondre(i === q.bonneReponseIndex)}
              className="rounded-lg border border-espace-border bg-white px-4 py-3 text-left text-espace-ink transition hover:border-espace-primary hover:bg-espace-surface"
            >
              {choix}
            </button>
          ))}
        </div>
        <p className="mt-4 text-sm text-espace-muted">Ton score : {score}</p>
      </main>
    );
  }

  if (phase === "resultat" && classement) {
    const jaiGagne = classement.findIndex((c) => c.moi) === 0;
    return (
      <main className="mx-auto max-w-xl px-6 py-10">
        <BackButton href={retourHref} />
        <p className="text-xs uppercase tracking-wide text-espace-muted">Résultat de la Battle</p>
        <h1 className="mt-1 text-2xl font-bold text-espace-ink">{jaiGagne ? "Victoire !" : "Bien joué !"}</h1>
        <p className="mt-1 font-medium text-espace-primary">+{xpGagne} XP</p>

        <div className="mt-6 flex flex-col gap-2">
          {classement.map((c, i) => (
            <div
              key={i}
              className={`flex items-center justify-between rounded-lg border px-4 py-3 ${
                c.moi ? "border-espace-primary bg-espace-surface" : "border-espace-border bg-white"
              }`}
            >
              <span className="text-espace-ink">
                <span className="mr-2 font-bold">{i + 1}.</span>
                {c.nom} {c.moi && "(toi)"}
              </span>
              <span className="text-sm text-espace-muted">
                {c.score} pts — {Math.round(c.tempsMs / 1000)}s
              </span>
            </div>
          ))}
        </div>
      </main>
    );
  }

  return null;
}
