"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ProgressBar } from "@/components/college/quetes/ProgressBar";
import type { QuestionRiasecClient } from "@/lib/college/riasec/questions";

/**
 * Interface 2 — Questionnaire RIASEC (36 questions, 6 blocs).
 * La couleur de la progression change à chaque bloc ; la fin d'un bloc
 * affiche un message de progression (+50 XP symboliques).
 */
export default function RiasecQuestionnairePage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<QuestionRiasecClient[]>([]);
  const [index, setIndex] = useState(0);
  const [reponses, setReponses] = useState<Record<string, string>>({}); // questionId -> optionId
  const [blocMessage, setBlocMessage] = useState<string | null>(null);
  const [intro, setIntro] = useState(true);
  const [chargement, setChargement] = useState(true);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/college/riasec/questions")
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.questions ?? []);
        setChargement(false);
      })
      .catch(() => {
        setErreur("Impossible de charger le questionnaire.");
        setChargement(false);
      });
  }, []);

  // Courte animation d'entrée : "Nouvelle quête..."
  useEffect(() => {
    if (!chargement) {
      const t = setTimeout(() => setIntro(false), 1000);
      return () => clearTimeout(t);
    }
  }, [chargement]);

  const question = questions[index];
  const total = questions.length;
  const progressPercent = total > 0 ? Math.round((index / total) * 100) : 0;
  const couleurBloc = question?.bloc.couleur ?? "#0F766E";

  const handleReponse = async (optionId: string) => {
    if (!question) return;
    const nouvellesReponses = { ...reponses, [question.id]: optionId };
    setReponses(nouvellesReponses);

    const blocTermine = questions
      .filter((q) => q.bloc.numero === question.bloc.numero)
      .every((q) => nouvellesReponses[q.id] !== undefined);

    if (blocTermine) {
      setBlocMessage(`Bloc « ${question.bloc.titre} » terminé`);
      setTimeout(() => setBlocMessage(null), 1200);
    }

    const prochainIndex = index + 1;
    if (prochainIndex >= total) {
      await soumettre(nouvellesReponses);
    } else {
      setIndex(prochainIndex);
    }
  };

  const soumettre = async (reponsesFinales: Record<string, string>) => {
    setEnvoiEnCours(true);
    const payload = Object.entries(reponsesFinales).map(([questionId, optionId]) => ({
      questionId,
      optionId,
    }));

    const res = await fetch("/api/college/riasec/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reponses: payload }),
    });

    if (res.ok) {
      router.push("/college/quetes/resultats");
    } else {
      const data = await res.json().catch(() => ({}));
      setErreur(data.error ?? "L'envoi a échoué. Réessaie.");
      setEnvoiEnCours(false);
    }
  };

  if (chargement || intro) {
    return (
      <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-espace-primary">
          Nouvelle quête...
        </p>
        <p className="mt-2 text-xl font-semibold text-espace-ink">Découvrir ton profil</p>
      </main>
    );
  }

  if (envoiEnCours) {
    return (
      <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 text-center">
        <p className="text-lg font-semibold text-espace-ink">Quête terminée</p>
        <p className="mt-2 text-espace-muted">Calcul de ton profil en cours…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col px-6 py-10">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium" style={{ color: couleurBloc }}>
          Bloc {question?.bloc.numero} — {question?.bloc.titre}
        </p>
      </div>
      <div className="mt-3">
        <ProgressBar
          value={progressPercent}
          label={`Question ${index + 1} / ${total}`}
          couleur={couleurBloc}
        />
      </div>

      {erreur && (
        <div className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{erreur}</div>
      )}

      {blocMessage && (
        <div
          className="mt-4 rounded-lg px-4 py-2 text-sm font-medium text-white"
          style={{ background: couleurBloc }}
        >
          {blocMessage} — +50 XP
        </div>
      )}

      {question && (
        <div className="mt-10">
          <p className="text-lg font-semibold text-espace-ink">{question.intitule}</p>

          <div className="mt-8 flex flex-col gap-2">
            {question.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleReponse(option.id)}
                className="rounded-lg border border-espace-border bg-white px-4 py-3 text-left text-espace-ink transition hover:bg-espace-surface"
                style={{ borderColor: undefined }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = couleurBloc)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "")}
              >
                {option.texte}
              </button>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
