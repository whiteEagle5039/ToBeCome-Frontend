"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CommunauteHeaderProps = {
  slug: string;
  nom: string;
  description: string;
  nbMembres: number;
  estMembre: boolean;
  estPrivee: boolean;
};

export function CommunauteHeader({
  slug,
  nom,
  description,
  nbMembres,
  estMembre,
  estPrivee,
}: CommunauteHeaderProps) {
  const router = useRouter();
  const [enCours, setEnCours] = useState(false);
  const [code, setCode] = useState("");
  const [demandeCode, setDemandeCode] = useState(false);

  const rejoindre = async () => {
    if (estPrivee && !demandeCode) {
      setDemandeCode(true);
      return;
    }
    setEnCours(true);
    const res = await fetch(`/api/college/communautes/${slug}/rejoindre`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codeInvitation: code || undefined }),
    });
    setEnCours(false);
    if (res.ok) {
      router.refresh();
    }
  };

  return (
    <div className="border-b border-espace-border px-6 py-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-espace-ink">{nom}</h1>
          <p className="mt-1 text-sm text-espace-muted">{description}</p>
          <p className="mt-2 text-xs text-espace-muted">{nbMembres} membres</p>
        </div>

        {!estMembre && (
          <div className="flex shrink-0 flex-col items-end gap-2">
            {demandeCode && (
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Code d'invitation"
                className="w-36 rounded-lg border border-espace-border px-3 py-2 text-sm"
              />
            )}
            <button
              onClick={rejoindre}
              disabled={enCours}
              className="rounded-lg bg-espace-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-espace-primaryDark disabled:opacity-60"
            >
              {estPrivee && !demandeCode ? "Rejoindre" : "Confirmer"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
