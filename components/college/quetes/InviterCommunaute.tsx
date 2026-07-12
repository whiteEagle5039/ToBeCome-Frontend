"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Communaute = { slug: string; nom: string };

type InviterCommunauteProps = {
  /** Message d'invitation prérempli (code d'accès Studio, lien Battle...). */
  message: string;
};

/**
 * Partage une invitation de jeu dans une communauté dont l'élève est membre.
 * L'invitation est publiée comme un message dans le fil de discussion.
 */
export function InviterCommunaute({ message }: InviterCommunauteProps) {
  const [communautes, setCommunautes] = useState<Communaute[]>([]);
  const [slug, setSlug] = useState("");
  const [texte, setTexte] = useState(message);
  const [envoi, setEnvoi] = useState(false);
  const [confirmation, setConfirmation] = useState<Communaute | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/college/communautes/mes")
      .then((res) => res.json())
      .then((data) => {
        const liste = data.communautes ?? [];
        setCommunautes(liste);
        if (liste.length > 0) setSlug(liste[0].slug);
      })
      .catch(() => {});
  }, []);

  const partager = async () => {
    setEnvoi(true);
    setErreur(null);
    const res = await fetch("/api/college/communautes/partager", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ communauteSlug: slug, contenu: texte }),
    });
    const data = await res.json();
    setEnvoi(false);
    if (!res.ok) {
      setErreur(data.error ?? "Le partage a échoué.");
      return;
    }
    setConfirmation(data.communaute);
  };

  if (confirmation) {
    return (
      <div className="mt-6 rounded-xl border border-espace-border bg-espace-surface p-4 text-sm">
        <p className="font-medium text-espace-ink">
          Invitation publiée dans « {confirmation.nom} ».
        </p>
        <Link
          href={`/college/communautes/${confirmation.slug}/discussions`}
          className="mt-1 inline-block font-medium text-espace-primary hover:underline"
        >
          Voir la discussion
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-xl border border-espace-border bg-white p-4">
      <p className="text-sm font-semibold text-espace-ink">Inviter d'autres joueurs</p>
      <p className="mt-1 text-xs text-espace-muted">
        Partage cette invitation dans une de tes communautés.
      </p>

      {communautes.length === 0 ? (
        <p className="mt-3 text-sm text-espace-muted">
          Tu n'es membre d'aucune communauté pour le moment.{" "}
          <Link href="/college/communautes" className="font-medium text-espace-primary hover:underline">
            Rejoins-en une
          </Link>{" "}
          pour inviter tes camarades.
        </p>
      ) : (
        <div className="mt-3 flex flex-col gap-3">
          <textarea
            value={texte}
            onChange={(e) => setTexte(e.target.value)}
            rows={3}
            className="w-full resize-none rounded-lg border border-espace-border px-3 py-2 text-sm text-espace-ink"
          />
          {erreur && <p className="text-sm text-red-600">{erreur}</p>}
          <div className="flex gap-2">
            <select
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="flex-1 rounded-lg border border-espace-border px-3 py-2 text-sm text-espace-ink"
            >
              {communautes.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.nom}
                </option>
              ))}
            </select>
            <button
              onClick={partager}
              disabled={envoi || !texte.trim()}
              className="rounded-lg bg-espace-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-espace-primaryDark disabled:opacity-50"
            >
              {envoi ? "Envoi..." : "Partager"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
