"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { BackButton } from "@/components/college/BackButton";
import { InviterCommunaute } from "@/components/college/quetes/InviterCommunaute";

type BattleType = "DUEL" | "BATTLE_ROYALE";
type Question = { question: string; choix: string[]; bonneReponseIndex: number };
type Participant = { prenom?: string; nom?: string; score: number; fini: boolean };
type Classement = { nom: string; score: number; tempsMs: number; moi: boolean; fantome: boolean }[];

const SECONDES_PAR_QUESTION = 15;

/**
 * Battle en ligne :
 * - Temps réel : deux joueurs (ou cinq en Royale) rejoignent la même session
 *   depuis n'importe où ; dès que la salle est pleine, chacun répond aux mêmes
 *   questions, chronométré ; le serveur départage (score puis vitesse).
 * - Asynchrone : affronter le « fantôme » du meilleur score enregistré,
 *   sans attendre personne. Le vainqueur est annoncé à la fin.
 */
export default function BattlePage() {
  const params = useParams<{ slug: string }>();
  const [phase, setPhase] = useState<"choix" | "attente" | "jeu" | "syncro" | "resultat">("choix");
  const [type, setType] = useState<BattleType>("DUEL");
  const [session, setSession] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [chrono, setChrono] = useState(SECONDES_PAR_QUESTION);
  const [debutJeu, setDebutJeu] = useState(0);
  const [classement, setClassement] = useState<Classement | null>(null);
  const [xpGagne, setXpGagne] = useState(0);
  const scoreRef = useRef(0);

  // ── File d'attente (temps réel) ────────────────────────────────────────────
  const rejoindre = async (t: BattleType) => {
    setType(t);
    const res = await fetch("/api/college/quetes/battle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ metierSlug: params.slug, type: t }),
    });
    const data = await res.json();
    setSession(data.session);
    if (data.session?.status === "EN_COURS" && data.session.questions?.length) {
      demarrerJeu(data.session.questions);
    } else {
      setPhase("attente");
    }
  };

  // ── Mode fantôme (asynchrone) ──────────────────────────────────────────────
  const jouerFantome = async () => {
    const res = await fetch("/api/college/quetes/battle/fantome", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ metierSlug: params.slug }),
    });
    const data = await res.json();
    setSession(data.session);
    demarrerJeu(data.session.questions);
  };

  // Polling de la salle d'attente : démarre dès que la salle est pleine
  useEffect(() => {
    if (phase !== "attente" || !session?.id) return;
    const t = setInterval(async () => {
      const res = await fetch(`/api/college/quetes/battle?sessionId=${session.id}`);
      const data = await res.json();
      if (!data.session) return;
      setSession(data.session);
      if (data.session.status === "EN_COURS" && data.session.questions?.length) {
        clearInterval(t);
        demarrerJeu(data.session.questions);
      }
    }, 2500);
    return () => clearInterval(t);
  }, [phase, session?.id]);

  const demarrerJeu = (qs: Question[]) => {
    setQuestions(qs);
    setIndex(0);
    setScore(0);
    scoreRef.current = 0;
    setDebutJeu(Date.now());
    setChrono(SECONDES_PAR_QUESTION);
    setPhase("jeu");
  };

  const terminer = useCallback(
    async (scoreFinal: number) => {
      setPhase("syncro");
      const res = await fetch("/api/college/quetes/battle/terminer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session.id,
          score: scoreFinal,
          tempsMs: Date.now() - debutJeu,
        }),
      });
      const data = await res.json();
      if (data.status === "TERMINEE") {
        setClassement(data.classement);
        setXpGagne(data.xpGagne);
        setPhase("resultat");
      }
    },
    [session?.id, debutJeu]
  );

  // Polling après avoir fini : attendre que les adversaires terminent
  useEffect(() => {
    if (phase !== "syncro" || !session?.id) return;
    const t = setInterval(async () => {
      const res = await fetch("/api/college/quetes/battle/terminer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: session.id, score: scoreRef.current, tempsMs: 0 }),
      });
      const data = await res.json();
      if (data.status === "TERMINEE") {
        clearInterval(t);
        setClassement(data.classement);
        setXpGagne(data.xpGagne);
        setPhase("resultat");
      }
    }, 3000);
    return () => clearInterval(t);
  }, [phase, session?.id]);

  const repondre = useCallback(
    (correct: boolean) => {
      const nouveauScore = score + (correct ? 1 : 0);
      setScore(nouveauScore);
      scoreRef.current = nouveauScore;
      if (index + 1 >= questions.length) {
        terminer(nouveauScore);
      } else {
        setIndex(index + 1);
        setChrono(SECONDES_PAR_QUESTION);
      }
    },
    [score, index, questions.length, terminer]
  );

  // Chronomètre par question : à zéro, la question est comptée fausse
  useEffect(() => {
    if (phase !== "jeu") return;
    if (chrono <= 0) {
      repondre(false);
      return;
    }
    const t = setTimeout(() => setChrono((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, chrono, repondre]);

  // ── Rendus ────────────────────────────────────────────────────────────────

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
        {session?.ghost && (
          <p className="mt-1 text-xs text-espace-muted">
            Adversaire : {session.ghost.nom} — {session.ghost.score}/{questions.length}
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

  if (phase === "syncro") {
    return (
      <main className="mx-auto max-w-xl px-6 py-10 text-center">
        <p className="text-lg font-semibold text-espace-ink">Tu as terminé !</p>
        <p className="mt-2 text-espace-muted">
          En attente que ton adversaire finisse sa série…
        </p>
      </main>
    );
  }

  if (phase === "resultat" && classement) {
    const jaiGagne = classement.findIndex((c) => c.moi) === 0;
    return (
      <main className="mx-auto max-w-xl px-6 py-10">
        <BackButton href={`/college/quetes/metiers/${params.slug}`} />
        <p className="text-xs uppercase tracking-wide text-espace-muted">Résultat de la Battle</p>
        <h1 className="mt-1 text-2xl font-bold text-espace-ink">
          {jaiGagne ? "Victoire !" : "Bien joué !"}
        </h1>
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

        <button
          onClick={() => {
            setPhase("choix");
            setSession(null);
            setClassement(null);
          }}
          className="mt-8 rounded-lg bg-espace-primary px-5 py-3 font-medium text-white transition hover:bg-espace-primaryDark"
        >
          Rejouer
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-10">
      <BackButton href={`/college/quetes/metiers/${params.slug}`} />
      <p className="text-xs uppercase tracking-wide text-espace-muted">Mode Battle</p>
      <h1 className="mt-1 text-2xl font-bold text-espace-ink">Choisis ton format</h1>

      {phase === "choix" && (
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => rejoindre("DUEL")}
            className="rounded-lg border border-espace-border bg-white p-4 text-left transition hover:border-espace-primary"
          >
            <p className="font-semibold text-espace-ink">Duel 1 vs 1 — temps réel</p>
            <p className="mt-1 text-sm text-espace-muted">
              Mêmes questions que ton adversaire, score et vitesse départagent.
            </p>
          </button>
          <button
            onClick={() => rejoindre("BATTLE_ROYALE")}
            className="rounded-lg border border-espace-border bg-white p-4 text-left transition hover:border-espace-primary"
          >
            <p className="font-semibold text-espace-ink">Battle Royale — 5 joueurs</p>
            <p className="mt-1 text-sm text-espace-muted">
              Plusieurs joueurs, un seul vainqueur au classement final.
            </p>
          </button>
          <button
            onClick={jouerFantome}
            className="rounded-lg border border-espace-border bg-white p-4 text-left transition hover:border-espace-primary"
          >
            <p className="font-semibold text-espace-ink">Contre un fantôme — asynchrone</p>
            <p className="mt-1 text-sm text-espace-muted">
              Joue immédiatement contre le meilleur score enregistré ; le vainqueur
              est annoncé à la fin.
            </p>
          </button>
        </div>
      )}

      {phase === "attente" && session && (
        <>
          <div className="mt-8 rounded-xl border border-espace-border bg-espace-surface p-5 text-center">
            <p className="font-medium text-espace-ink">En attente d'adversaires…</p>
            <p className="mt-1 text-sm text-espace-muted">
              {session.participants?.length ?? 1} joueur(s) présent(s) —{" "}
              {type === "DUEL" ? "2 requis" : "5 requis"}
            </p>
            <p className="mt-2 text-xs text-espace-muted">
              La partie démarre automatiquement dès que la salle est pleine.
            </p>
            <button
              onClick={jouerFantome}
              className="mt-4 text-sm font-medium text-espace-primary hover:underline"
            >
              Personne ne vient ? Joue contre un fantôme
            </button>
          </div>

          <InviterCommunaute
            message={`Qui me rejoint en Battle (${type === "DUEL" ? "Duel 1 vs 1" : "Battle Royale"}) ? Va dans Quêtes, choisis le métier, mode Battle : /college/quetes/metiers/${params.slug}/battle`}
          />
        </>
      )}
    </main>
  );
}
