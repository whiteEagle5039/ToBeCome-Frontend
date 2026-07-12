"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProgressBar } from "./ProgressBar";

const SECONDES_DEFI_RAPIDE = 45;

type Etape = {
  id: string;
  ordre: number;
  type: "QUIZ" | "MISE_EN_SITUATION" | "DEFI_RAPIDE" | "PROJET_FINAL";
  titre: string;
  contenu: any;
};

type ChapterRunnerProps = {
  missionId: string;
  metierSlug: string;
  etapes: Etape[];
};

export function ChapterRunner({ missionId, metierSlug, etapes }: ChapterRunnerProps) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [resultats, setResultats] = useState<
    { etapeId: string; isComplete: boolean; score: number }[]
  >([]);
  const [envoi, setEnvoi] = useState(false);
  const [xpGagne, setXpGagne] = useState<number | null>(null);

  const etape = etapes[index];
  const total = etapes.length;

  const validerEtape = async (correct: boolean) => {
    const nouveauxResultats = [
      ...resultats,
      { etapeId: etape.id, isComplete: correct, score: correct ? 1 : 0 },
    ];
    setResultats(nouveauxResultats);

    if (index + 1 >= total) {
      setEnvoi(true);
      const res = await fetch(`/api/college/quetes/missions/${missionId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ etapes: nouveauxResultats }),
      });
      const data = await res.json().catch(() => ({}));
      setXpGagne(data.xpGagne ?? 0);
      setTimeout(() => {
        router.push(`/college/quetes/metiers/${metierSlug}/aventure`);
        router.refresh();
      }, 1400);
    } else {
      setIndex(index + 1);
    }
  };

  if (envoi) {
    return (
      <div className="py-10 text-center">
        <p className="text-lg font-semibold text-espace-ink">Chapitre terminé</p>
        {xpGagne !== null && xpGagne > 0 && (
          <p className="mt-2 text-xl font-bold text-espace-primary">+{xpGagne} XP</p>
        )}
        <p className="mt-2 text-espace-muted">Enregistrement de ta progression…</p>
      </div>
    );
  }

  if (!etape) {
    return <p className="text-espace-muted">Aucune quête dans ce chapitre.</p>;
  }

  return (
    <div>
      <ProgressBar
        value={Math.round((index / total) * 100)}
        label={`Quête ${index + 1} / ${total}`}
      />

      <div className="mt-8">
        <p className="text-xs uppercase tracking-wide text-espace-primary">
          {libelleType(etape.type)}
        </p>
        <h2 className="mt-1 text-xl font-semibold text-espace-ink">{etape.titre}</h2>

        {etape.type === "QUIZ" && <QuizEtape contenu={etape.contenu} onValider={validerEtape} />}
        {etape.type === "MISE_EN_SITUATION" && (
          <SituationEtape contenu={etape.contenu} onValider={validerEtape} />
        )}
        {etape.type === "DEFI_RAPIDE" && (
          <DefiRapideEtape contenu={etape.contenu} onValider={validerEtape} />
        )}
        {etape.type === "PROJET_FINAL" && (
          <ProjetFinalEtape contenu={etape.contenu} onValider={() => validerEtape(true)} />
        )}
      </div>
    </div>
  );
}

function libelleType(type: Etape["type"]) {
  switch (type) {
    case "QUIZ":
      return "Quiz";
    case "MISE_EN_SITUATION":
      return "Situation";
    case "DEFI_RAPIDE":
      return "Défi rapide";
    case "PROJET_FINAL":
      return "Projet final";
  }
}

// Contenu : { question, choix[], bonneReponseIndex }
function QuizEtape({
  contenu,
  onValider,
}: {
  contenu: { question: string; choix: string[]; bonneReponseIndex: number };
  onValider: (correct: boolean) => void;
}) {
  return (
    <div className="mt-4">
      <p className="text-espace-ink">{contenu.question}</p>
      <div className="mt-4 flex flex-col gap-2">
        {contenu.choix.map((choix, i) => (
          <button
            key={i}
            onClick={() => onValider(i === contenu.bonneReponseIndex)}
            className="rounded-lg border border-espace-border bg-white px-4 py-3 text-left text-espace-ink transition hover:border-espace-primary hover:bg-espace-surface"
          >
            {choix}
          </button>
        ))}
      </div>
    </div>
  );
}

// Contenu : { scenario, choix: [{ texte, estBonneDecision }] }
function SituationEtape({
  contenu,
  onValider,
}: {
  contenu: { scenario: string; choix: { texte: string; estBonneDecision: boolean }[] };
  onValider: (correct: boolean) => void;
}) {
  return (
    <div className="mt-4">
      <p className="text-espace-ink">{contenu.scenario}</p>
      <div className="mt-4 flex flex-col gap-2">
        {contenu.choix.map((c, i) => (
          <button
            key={i}
            onClick={() => onValider(c.estBonneDecision)}
            className="rounded-lg border border-espace-border bg-white px-4 py-3 text-left text-espace-ink transition hover:border-espace-primary hover:bg-espace-surface"
          >
            {c.texte}
          </button>
        ))}
      </div>
    </div>
  );
}

// Contenu : { affirmation, estVraie } — chronométré : à zéro, compté faux
function DefiRapideEtape({
  contenu,
  onValider,
}: {
  contenu: { affirmation: string; estVraie: boolean };
  onValider: (correct: boolean) => void;
}) {
  const [chrono, setChrono] = useState(SECONDES_DEFI_RAPIDE);

  useEffect(() => {
    if (chrono <= 0) {
      onValider(false);
      return;
    }
    const t = setTimeout(() => setChrono((c) => c - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chrono]);

  return (
    <div className="mt-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs uppercase tracking-wide text-espace-muted">Chronométré</span>
        <span
          className={`rounded-full px-3 py-1 text-sm font-bold ${
            chrono <= 10 ? "bg-red-100 text-red-700" : "bg-espace-surface text-espace-primary"
          }`}
        >
          {chrono}s
        </span>
      </div>
      <div className="mb-4 h-1.5 w-full rounded-full bg-espace-border">
        <div
          className="h-full rounded-full bg-espace-accent transition-all duration-1000 ease-linear"
          style={{ width: `${(chrono / SECONDES_DEFI_RAPIDE) * 100}%` }}
        />
      </div>
      <p className="text-espace-ink">{contenu.affirmation}</p>
      <div className="mt-4 flex gap-3">
        <button
          onClick={() => onValider(contenu.estVraie === true)}
          className="flex-1 rounded-lg border border-espace-border bg-white px-4 py-3 font-medium text-espace-ink transition hover:border-espace-primary hover:bg-espace-surface"
        >
          Vrai
        </button>
        <button
          onClick={() => onValider(contenu.estVraie === false)}
          className="flex-1 rounded-lg border border-espace-border bg-white px-4 py-3 font-medium text-espace-ink transition hover:border-espace-primary hover:bg-espace-surface"
        >
          Faux
        </button>
      </div>
    </div>
  );
}

// Contenu : { consigne }
function ProjetFinalEtape({
  contenu,
  onValider,
}: {
  contenu: { consigne: string };
  onValider: () => void;
}) {
  return (
    <div className="mt-4">
      <p className="text-espace-ink">{contenu.consigne}</p>
      <button
        onClick={onValider}
        className="mt-6 rounded-lg bg-espace-primary px-5 py-3 font-medium text-white transition hover:bg-espace-primaryDark"
      >
        Valider le projet
      </button>
    </div>
  );
}
