"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * V1 : l'image est référencée par URL. Pour un véritable envoi de fichier
 * depuis l'appareil, il faudra brancher un service de stockage (S3,
 * Cloudinary, Vercel Blob...) et remplacer le champ URL par un composant
 * d'upload qui retourne l'URL finale avant cet appel.
 */
export function AjouterPhotoForm({ slug }: { slug: string }) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState("");
  const [legende, setLegende] = useState("");
  const [ouvert, setOuvert] = useState(false);
  const [envoi, setEnvoi] = useState(false);

  const soumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnvoi(true);
    const res = await fetch(`/api/college/communautes/${slug}/galerie`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl, legende: legende || undefined }),
    });
    setEnvoi(false);
    if (res.ok) {
      setImageUrl("");
      setLegende("");
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
        Ajouter une photo
      </button>
    );
  }

  return (
    <form onSubmit={soumettre} className="rounded-xl border border-espace-border bg-white p-4">
      <div className="flex flex-col gap-3">
        <input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="URL de l'image"
          required
          className="rounded-lg border border-espace-border px-3 py-2 text-sm"
        />
        <input
          value={legende}
          onChange={(e) => setLegende(e.target.value)}
          placeholder="Légende (facultatif)"
          className="rounded-lg border border-espace-border px-3 py-2 text-sm"
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
            Ajouter
          </button>
        </div>
      </div>
    </form>
  );
}
