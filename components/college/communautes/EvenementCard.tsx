"use client";

import { useState } from "react";

type EvenementCardProps = {
  slug: string;
  evenementId: string;
  titre: string;
  description: string;
  lieu: string | null;
  dateDebut: string;
  nbParticipants: number;
};

const FORMATTEUR_DATE = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
});

export function EvenementCard({
  slug,
  evenementId,
  titre,
  description,
  lieu,
  dateDebut,
  nbParticipants,
}: EvenementCardProps) {
  const [statut, setStatut] = useState<"INTERESSE" | "PARTICIPE" | null>(null);
  const [compteur, setCompteur] = useState(nbParticipants);

  const participer = async (nouveauStatut: "INTERESSE" | "PARTICIPE") => {
    const res = await fetch(`/api/college/communautes/${slug}/evenements/${evenementId}/participer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut: nouveauStatut }),
    });
    if (res.ok) {
      if (!statut) setCompteur((c) => c + 1);
      setStatut(nouveauStatut);
    }
  };

  return (
    <div className="rounded-xl border border-espace-border bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-espace-primary">
        {FORMATTEUR_DATE.format(new Date(dateDebut))}
      </p>
      <h3 className="mt-1 font-semibold text-espace-ink">{titre}</h3>
      <p className="mt-1 text-sm text-espace-muted">{description}</p>
      {lieu && <p className="mt-1 text-xs text-espace-muted">Lieu : {lieu}</p>}
      <p className="mt-2 text-xs text-espace-muted">{compteur} participant(s)</p>

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => participer("INTERESSE")}
          className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
            statut === "INTERESSE"
              ? "border-espace-primary bg-espace-surface text-espace-primary"
              : "border-espace-border text-espace-ink hover:border-espace-primary"
          }`}
        >
          Intéressé
        </button>
        <button
          onClick={() => participer("PARTICIPE")}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
            statut === "PARTICIPE"
              ? "bg-espace-primaryDark text-white"
              : "bg-espace-primary text-white hover:bg-espace-primaryDark"
          }`}
        >
          Je participe
        </button>
      </div>
    </div>
  );
}
