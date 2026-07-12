"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BackButton } from "@/components/college/BackButton";

type Defi = {
  id: string;
  contenu: { question: string; choix: string[]; bonneReponseIndex: number }[];
  xpRecompense: number;
  metier: { nom: string };
};

/**
 * Interface Défi du jour : quiz quotidien du métier, chronométré,
 * une seule tentative par jour, XP + série (streak).
 */
export default function DefiDuJourPage() {
  const params = useParams<{ slug: string }>();
  const [defi, setDefi] = useState<Defi | null>(null);
  const [dejaFait, setDejaFait] = useState(false);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [debut] = useState(() => Date.now());
  const [secondes, setSecondes] = useState(0);
  const [termine, setTermine] = useState(false);
  const [xpGagne, setXpGagne] = useState(0);
  const [streak, setStreak] = useState<number | null>(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    fetch(`/api/college/quetes/defi?metier=${params.slug}`)
      .then((res) => res.json())
      .then((data) => {
        setDefi(data.defi);
        setDejaFait(data.dejaFait ?? false);
        setChargement(false);
      })
      .catch(() => setChargement(false));
  }, [params.slug]);

  // Chronomètre affiché
  useEffect(() => {
    if (termine || dejaFait) return;
    const t = setInterval(() => setSecondes(Math.round((Date.now() - debut) / 1000)), 1000);
    return () => clearInterval(t);
  }, [debut, termine, dejaFait]);

  const repondre = async (bonneReponse: boolean) => {
    const nouveauScore = score + (bonneReponse ? 1 : 0);
    setScore(nouveauScore);

    if (!defi) return;
    const questions = defi.contenu;

    if (index + 1 >= questions.length) {
      const dureeSecondes = Math.round((Date.now() - debut) / 1000);
      const res = await fetch("/api/college/quetes/defi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ defiId: defi.id, score: nouveauScore, dureeSecondes }),
      });
      const data = await res.json();
      setXpGagne(data.xpGagne ?? 0);
      setStreak(data.streak ?? null);
      setTermine(true);
    } else {
      setIndex(index + 1);
    }
  };

  if (chargement) {
    return (
      <main className="mx-auto max-w-xl px-6 py-10">
        <p className="text-espace-muted">Chargement du défi…</p>
      </main>
    );
  }

  if (!defi) {
    return (
      <main className="mx-auto max-w-xl px-6 py-10">
        <p className="text-espace-muted">Aucun défi disponible aujourd'hui pour ce métier.</p>
      </main>
    );
  }

  if (dejaFait) {
    return (
      <main className="mx-auto max-w-xl px-6 py-10 text-center">
        <p className="text-lg font-semibold text-espace-ink">Défi déjà réalisé</p>
        <p className="mt-2 text-espace-muted">Reviens demain pour un nouveau défi.</p>
      </main>
    );
  }

  if (termine) {
    return (
      <main className="mx-auto max-w-xl px-6 py-10 text-center">
        <p className="text-lg font-semibold text-espace-ink">Défi terminé</p>
        <p className="mt-2 text-espace-muted">
          Score : {score} / {defi.contenu.length}
        </p>
        <p className="mt-1 font-medium text-espace-primary">+{xpGagne} XP</p>
        {streak !== null && streak > 0 && (
          <p className="mt-1 text-sm text-espace-muted">Série en cours : {streak} jour{streak > 1 ? "s" : ""}</p>
        )}
      </main>
    );
  }

  const question = defi.contenu[index];

  return (
    <main className="mx-auto max-w-xl px-6 py-10">
      <BackButton href={`/college/quetes/metiers/${params.slug}`} />
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wide text-espace-muted">
          Défi du jour — {defi.metier.nom}
        </p>
        <span className="rounded-full bg-espace-surface px-3 py-1 text-xs font-medium text-espace-primary">
          {Math.floor(secondes / 60)}:{String(secondes % 60).padStart(2, "0")}
        </span>
      </div>
      <p className="mt-1 text-sm text-espace-muted">
        Question {index + 1} / {defi.contenu.length} — +{defi.xpRecompense} XP à la clé
      </p>

      <div className="mt-6">
        <p className="text-lg font-semibold text-espace-ink">{question.question}</p>
        <div className="mt-4 flex flex-col gap-2">
          {question.choix.map((choix, i) => (
            <button
              key={i}
              onClick={() => repondre(i === question.bonneReponseIndex)}
              className="rounded-lg border border-espace-border bg-white px-4 py-3 text-left text-espace-ink transition hover:border-espace-primary hover:bg-espace-surface"
            >
              {choix}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
