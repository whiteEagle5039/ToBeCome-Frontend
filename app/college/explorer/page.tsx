"use client";

import { useState } from "react";
import VideoFeed from "@/components/college/VideoFeed";
import Link from "next/link";
import { matieresList } from "@/data/college/metiers";

export default function ExplorerPage() {
  const [mode, setMode] = useState<"videos" | "fiches">("videos");

  return (
    <div>
      {/* Sélecteur en haut de l'écran */}
      <div className="px-4 pt-6 pb-3 sticky top-0 z-10" style={{ background: "var(--college-bg)" }}>
        <h1 className="college-title text-xl mb-3">Explorer</h1>
        <div
          className="grid grid-cols-2 p-1 rounded-full"
          style={{ background: "var(--college-teal-100)" }}
        >
          <button
            onClick={() => setMode("videos")}
            className="py-2 rounded-full text-sm font-semibold transition-colors"
            style={{
              background: mode === "videos" ? "var(--college-teal-700)" : "transparent",
              color: mode === "videos" ? "white" : "var(--college-teal-700)",
            }}
          >
            🎬 Vidéos
          </button>
          <button
            onClick={() => setMode("fiches")}
            className="py-2 rounded-full text-sm font-semibold transition-colors"
            style={{
              background: mode === "fiches" ? "var(--college-teal-700)" : "transparent",
              color: mode === "fiches" ? "white" : "var(--college-teal-700)",
            }}
          >
            📇 Fiches métiers
          </button>
        </div>
      </div>

      {mode === "videos" ? (
        <VideoFeed />
      ) : (
        <div className="px-4 pb-6 grid grid-cols-2 gap-3">
          {matieresList.map((m) => (
            <Link
              key={m.slug}
              href={`/college/explorer/fiches/${m.slug}`}
              className="college-card p-4 flex flex-col items-center justify-center gap-2 aspect-square"
            >
              <span className="text-3xl">{m.emoji}</span>
              <span className="text-sm font-semibold text-center">{m.nom}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
