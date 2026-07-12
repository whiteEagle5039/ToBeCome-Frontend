"use client";

import { useState } from "react";

type Auteur = { prenom: string; nom: string };
type Reponse = { id: string; contenu: string; auteur: Auteur; createdAt: string };
type Reaction = { id: string; emoji: string; auteurId: string };
type Publication = {
  id: string;
  contenu: string;
  auteur: Auteur;
  createdAt: string;
  reponses: Reponse[];
  reactions: Reaction[];
};

const REACTIONS_DISPONIBLES = ["like", "bravo", "interessant"];
const LIBELLES_REACTIONS: Record<string, string> = {
  like: "J'aime",
  bravo: "Bravo",
  interessant: "Intéressant",
};

export function FilDiscussion({
  slug,
  publicationsInitiales,
  eleveIdCourant,
}: {
  slug: string;
  publicationsInitiales: Publication[];
  eleveIdCourant?: string | null;
}) {
  const [publications, setPublications] = useState(publicationsInitiales);
  const [nouveauMessage, setNouveauMessage] = useState("");
  const [envoi, setEnvoi] = useState(false);

  const publier = async () => {
    if (!nouveauMessage.trim()) return;
    setEnvoi(true);
    const res = await fetch(`/api/college/communautes/${slug}/publications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contenu: nouveauMessage }),
    });
    setEnvoi(false);
    if (res.ok) {
      const data = await res.json();
      setPublications([{ ...data.publication, reponses: [], reactions: [] }, ...publications]);
      setNouveauMessage("");
    }
  };

  const reagir = async (publicationId: string, emoji: string) => {
    const res = await fetch(`/api/college/communautes/${slug}/publications/${publicationId}/reactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emoji }),
    });
    if (!res.ok) return;
    const data = await res.json();

    setPublications((prev) =>
      prev.map((p) => {
        if (p.id !== publicationId) return p;
        const sansMaReaction = p.reactions.filter((r) => r.auteurId !== eleveIdCourant);
        return {
          ...p,
          reactions: data.reaction
            ? [...sansMaReaction, { id: data.reaction.id, emoji: data.reaction.emoji, auteurId: eleveIdCourant! }]
            : sansMaReaction,
        };
      })
    );
  };

  const repondre = async (publicationId: string, contenu: string) => {
    if (!contenu.trim()) return;
    const res = await fetch(`/api/college/communautes/${slug}/publications/${publicationId}/reponses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contenu }),
    });
    if (!res.ok) return;
    const data = await res.json();
    setPublications((prev) =>
      prev.map((p) => (p.id === publicationId ? { ...p, reponses: [...p.reponses, data.reponse] } : p))
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-espace-border bg-white p-4">
        <textarea
          value={nouveauMessage}
          onChange={(e) => setNouveauMessage(e.target.value)}
          placeholder="Partage quelque chose avec la communauté…"
          rows={3}
          className="w-full resize-none rounded-lg border border-espace-border p-3 text-sm text-espace-ink outline-none focus:border-espace-primary"
        />
        <div className="mt-2 flex justify-end">
          <button
            onClick={publier}
            disabled={envoi || !nouveauMessage.trim()}
            className="rounded-lg bg-espace-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-espace-primaryDark disabled:opacity-60"
          >
            Publier
          </button>
        </div>
      </div>

      {publications.map((p) => (
        <PublicationItem
          key={p.id}
          publication={p}
          eleveIdCourant={eleveIdCourant}
          onReagir={(emoji) => reagir(p.id, emoji)}
          onRepondre={(contenu) => repondre(p.id, contenu)}
        />
      ))}

      {publications.length === 0 && (
        <p className="text-center text-sm text-espace-muted">
          Aucune discussion pour le moment. Sois le premier à publier.
        </p>
      )}
    </div>
  );
}

function PublicationItem({
  publication,
  eleveIdCourant,
  onReagir,
  onRepondre,
}: {
  publication: Publication;
  eleveIdCourant?: string | null;
  onReagir: (emoji: string) => void;
  onRepondre: (contenu: string) => void;
}) {
  const [reponseTexte, setReponseTexte] = useState("");
  const maReaction = publication.reactions.find((r) => r.auteurId === eleveIdCourant)?.emoji;

  const compterReactions = (emoji: string) =>
    publication.reactions.filter((r) => r.emoji === emoji).length;

  return (
    <article className="rounded-xl border border-espace-border bg-white p-4">
      <p className="text-sm font-semibold text-espace-ink">
        {publication.auteur.prenom} {publication.auteur.nom}
      </p>
      <p className="mt-1 text-espace-ink">{publication.contenu}</p>

      <div className="mt-3 flex gap-2">
        {REACTIONS_DISPONIBLES.map((emoji) => (
          <button
            key={emoji}
            onClick={() => onReagir(emoji)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              maReaction === emoji
                ? "border-espace-primary bg-espace-surface text-espace-primary"
                : "border-espace-border text-espace-muted hover:border-espace-primary"
            }`}
          >
            {LIBELLES_REACTIONS[emoji]} {compterReactions(emoji) > 0 && `(${compterReactions(emoji)})`}
          </button>
        ))}
      </div>

      {publication.reponses.length > 0 && (
        <div className="mt-4 flex flex-col gap-2 border-l-2 border-espace-border pl-4">
          {publication.reponses.map((r) => (
            <div key={r.id}>
              <p className="text-xs font-semibold text-espace-ink">
                {r.auteur.prenom} {r.auteur.nom}
              </p>
              <p className="text-sm text-espace-ink">{r.contenu}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 flex gap-2">
        <input
          value={reponseTexte}
          onChange={(e) => setReponseTexte(e.target.value)}
          placeholder="Répondre…"
          className="flex-1 rounded-lg border border-espace-border px-3 py-2 text-sm outline-none focus:border-espace-primary"
        />
        <button
          onClick={() => {
            onRepondre(reponseTexte);
            setReponseTexte("");
          }}
          className="rounded-lg border border-espace-border px-3 py-2 text-sm font-medium text-espace-ink transition hover:border-espace-primary"
        >
          Envoyer
        </button>
      </div>
    </article>
  );
}
