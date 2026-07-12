"use client";

import { useState } from "react";
import { metiers } from "@/data/college/metiers";
import MetierCard from "@/components/college/MetierCard";

export default function FavorisPage() {
  const [onglet, setOnglet] = useState<"metiers" | "videos">("metiers");

  // TODO: remplacer par les vrais favoris de l'élève
  const metiersFavoris = metiers.slice(0, 2);
  const videosFavorites: { titre: string }[] = [];

  return (
    <div className="px-4 pt-6 pb-6">
      <h1 className="college-title text-xl mb-4">Favoris</h1>

      <div className="grid grid-cols-2 p-1 rounded-full mb-4" style={{ background: "var(--college-teal-100)" }}>
        <button
          onClick={() => setOnglet("metiers")}
          className="py-2 rounded-full text-sm font-semibold"
          style={{
            background: onglet === "metiers" ? "var(--college-teal-700)" : "transparent",
            color: onglet === "metiers" ? "white" : "var(--college-teal-700)",
          }}
        >
          Métiers favoris
        </button>
        <button
          onClick={() => setOnglet("videos")}
          className="py-2 rounded-full text-sm font-semibold"
          style={{
            background: onglet === "videos" ? "var(--college-teal-700)" : "transparent",
            color: onglet === "videos" ? "white" : "var(--college-teal-700)",
          }}
        >
          Vidéos favorites
        </button>
      </div>

      {onglet === "metiers" ? (
        <div className="grid grid-cols-2 gap-3">
          {metiersFavoris.map((m) => (
            <MetierCard key={m.slug} metier={m} href={`/college/explorer/fiches/${m.matieres[0]}/${m.slug}`} />
          ))}
        </div>
      ) : videosFavorites.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--college-ink-600)" }}>
          Aucune vidéo favorite pour le moment.
        </p>
      ) : (
        <div className="space-y-3">
          {videosFavorites.map((v, i) => (
            <div key={i} className="college-card p-4">{v.titre}</div>
          ))}
        </div>
      )}
    </div>
  );
}
