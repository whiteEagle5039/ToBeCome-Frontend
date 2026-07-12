"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NouvelleCommunautePage() {
  const router = useRouter();
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(false);

  const soumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur(null);
    setChargement(true);

    const res = await fetch("/api/college/communautes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, description }),
    });
    const data = await res.json();
    setChargement(false);

    if (!res.ok) {
      setErreur(data.error ?? "Une erreur est survenue.");
      return;
    }

    router.push(`/college/communautes/${data.communaute.slug}`);
  };

  return (
    <main className="mx-auto max-w-lg px-6 py-10">
      <h1 className="text-2xl font-bold text-espace-ink">Créer une communauté privée</h1>
      <p className="mt-2 text-sm text-espace-muted">
        Un code d'invitation sera généré pour que les personnes que tu invites puissent la rejoindre.
      </p>

      <form onSubmit={soumettre} className="mt-6 flex flex-col gap-4">
        {erreur && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-espace-danger">{erreur}</div>
        )}

        <div>
          <label className="text-sm font-medium text-espace-ink">Nom de la communauté</label>
          <input
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Ex : Promotion BTS 2027"
            className="mt-1 w-full rounded-lg border border-espace-border px-4 py-3 text-espace-ink"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-espace-ink">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 w-full resize-none rounded-lg border border-espace-border px-4 py-3 text-espace-ink"
            required
          />
        </div>

        <button
          type="submit"
          disabled={chargement}
          className="rounded-lg bg-espace-primary px-5 py-3 font-medium text-white transition hover:bg-espace-primaryDark disabled:opacity-60"
        >
          Créer la communauté
        </button>
      </form>
    </main>
  );
}
