"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ConnexionCollegePage() {
  const router = useRouter();
  const [identifiant, setIdentifiant] = useState("");
  const [password, setPassword] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(false);

  const soumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur(null);
    setChargement(true);

    try {
      const res = await fetch("/api/college/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifiant, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErreur(data.error ?? "Connexion impossible.");
        setChargement(false);
        return;
      }

      router.push("/college/accueil");
      router.refresh();
    } catch {
      setErreur("Impossible de contacter le serveur.");
      setChargement(false);
    }
  };

  return (
    <div className="px-6 pt-16 pb-10 flex flex-col min-h-dvh">
      <div className="text-center">
        <div
          className="mx-auto w-16 h-16 rounded-full flex items-center justify-center text-3xl"
          style={{ background: "var(--college-yellow-100)" }}
        >
          🚀
        </div>
        <h1 className="college-title text-2xl mt-4">Content de te revoir !</h1>
        <p className="mt-2 text-sm" style={{ color: "var(--college-ink-600)" }}>
          Connecte-toi avec ton matricule pour continuer ton aventure.
        </p>
      </div>

      <form onSubmit={soumettre} className="mt-10 flex flex-col gap-4">
        {erreur && (
          <div
            className="rounded-xl px-4 py-3 text-sm"
            style={{ background: "#FEE2E2", color: "#B91C1C" }}
          >
            {erreur}
          </div>
        )}

        <div>
          <label className="text-sm font-semibold">Matricule</label>
          <input
            value={identifiant}
            onChange={(e) => setIdentifiant(e.target.value)}
            placeholder="Ex : TBC-2026-0001"
            autoComplete="username"
            required
            className="mt-1 w-full rounded-xl border px-4 py-3"
            style={{ borderColor: "var(--college-border)", background: "var(--college-surface)" }}
          />
        </div>

        <div>
          <label className="text-sm font-semibold">Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ton mot de passe"
            autoComplete="current-password"
            required
            className="mt-1 w-full rounded-xl border px-4 py-3"
            style={{ borderColor: "var(--college-border)", background: "var(--college-surface)" }}
          />
        </div>

        <button
          type="submit"
          disabled={chargement}
          className="college-btn-primary mt-4 px-6 py-3 disabled:opacity-60"
        >
          {chargement ? "Connexion…" : "Se connecter"}
        </button>
      </form>

      <p className="mt-8 text-center text-xs" style={{ color: "var(--college-ink-600)" }}>
        Ton matricule t'est fourni par ton établissement.
      </p>
    </div>
  );
}
