"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AjouterRessourceForm({ slug }: { slug: string }) {
  const router = useRouter();
  const [titre, setTitre] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [ouvert, setOuvert] = useState(false);
  const [envoi, setEnvoi] = useState(false);

  const soumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnvoi(true);
    const res = await fetch(`/api/college/communautes/${slug}/ressources`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titre, url, description: description || undefined }),
    });
    setEnvoi(false);
    if (res.ok) {
      setTitre("");
      setUrl("");
      setDescription("");
      setOuvert(false);
      router.refresh();
    }
  };

  if (!ouvert) {
    return (
      <button
        onClick={() => setOuvert(true)}
        className="rounded-lg border border-espace-primary px-4 py-2 text-sm font-medium text-espace-primary transition hover:bg-espace-surface"
      >
        Partager une ressource
      </button>
    );
  }

  return (
    <form onSubmit={soumettre} className="rounded-xl border border-espace-border bg-white p-4">
      <div className="flex flex-col gap-3">
        <input
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          placeholder="Titre de la ressource"
          required
          className="rounded-lg border border-espace-border px-3 py-2 text-sm"
        />
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://…"
          required
          className="rounded-lg border border-espace-border px-3 py-2 text-sm"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (facultatif)"
          rows={2}
          className="resize-none rounded-lg border border-espace-border px-3 py-2 text-sm"
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setOuvert(false)}
            className="rounded-lg px-4 py-2 text-sm text-espace-muted"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={envoi}
            className="rounded-lg bg-espace-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-espace-primaryDark disabled:opacity-60"
          >
            Partager
          </button>
        </div>
      </div>
    </form>
  );
}
