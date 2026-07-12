"use client";

import { useState } from "react";

type DefiCardProps = {
  slug: string;
  defiId: string;
  titre: string;
  description: string;
  xpRecompense: number;
  dejaTermine: boolean;
  nbParticipants: number;
};

export function DefiCard({
  slug,
  defiId,
  titre,
  description,
  xpRecompense,
  dejaTermine,
  nbParticipants,
}: DefiCardProps) {
  const [termine, setTermine] = useState(dejaTermine);
  const [enCours, setEnCours] = useState(false);

  const valider = async () => {
    setEnCours(true);
    const res = await fetch(`/api/college/communautes/${slug}/defis/${defiId}/participer`, {
      method: "POST",
    });
    setEnCours(false);
    if (res.ok) setTermine(true);
  };

  return (
    <div className="rounded-xl border border-espace-border bg-white p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-espace-ink">{titre}</h3>
          <p className="mt-1 text-sm text-espace-muted">{description}</p>
          <p className="mt-2 text-xs text-espace-muted">{nbParticipants} participant(s)</p>
        </div>
        <span className="shrink-0 rounded-full bg-espace-accent px-2 py-1 text-xs font-bold text-espace-ink">
          +{xpRecompense} XP
        </span>
      </div>

      <button
        onClick={valider}
        disabled={termine || enCours}
        className="mt-3 rounded-lg bg-espace-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-espace-primaryDark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {termine ? "Défi terminé" : "Marquer comme terminé"}
      </button>
    </div>
  );
}
