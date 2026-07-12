"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BackButton } from "@/components/college/BackButton";
import { InviterCommunaute } from "@/components/college/quetes/InviterCommunaute";

const ROLES = [
  { valeur: "DEVELOPPEUR", label: "Développeur" },
  { valeur: "UI_DESIGNER", label: "UI Designer" },
  { valeur: "UX_DESIGNER", label: "UX Designer" },
  { valeur: "DATA_ANALYST", label: "Data Analyst" },
  { valeur: "COMMUNITY_MANAGER", label: "Community Manager" },
  { valeur: "PRODUCT_MANAGER", label: "Product Manager" },
];

const PHASES = ["IDEE", "CONCEPTION", "CONSTRUCTION", "FINALISATION"] as const;
const PHASE_LABELS: Record<string, string> = {
  IDEE: "Idée",
  CONCEPTION: "Conception",
  CONSTRUCTION: "Construction",
  FINALISATION: "Finalisation",
};

/**
 * Interface Studio : créer une équipe ou en rejoindre une avec un code,
 * chacun choisit librement son rôle.
 */
export default function StudioPage() {
  const params = useParams<{ slug: string }>();
  const [mode, setMode] = useState<"choix" | "creer" | "rejoindre">("choix");
  const [titre, setTitre] = useState("");
  const [code, setCode] = useState("");
  const [role, setRole] = useState(ROLES[0].valeur);
  const [projet, setProjet] = useState<any>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [projetsOuverts, setProjetsOuverts] = useState<any[]>([]);

  // Projets ouverts du métier : tout élève peut en rejoindre un à tout moment
  useEffect(() => {
    fetch(`/api/college/quetes/studio?metier=${params.slug}`)
      .then((res) => res.json())
      .then((data) => setProjetsOuverts(data.projets ?? []))
      .catch(() => {});
  }, [params.slug, projet]);

  const creerProjet = async () => {
    setErreur(null);
    const res = await fetch("/api/college/quetes/studio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ metierSlug: params.slug, titre, role }),
    });
    const data = await res.json();
    if (!res.ok) return setErreur(data.error ?? "Création impossible.");
    setProjet(data.project);
  };

  const rejoindreProjet = async () => {
    setErreur(null);
    const res = await fetch("/api/college/quetes/studio", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codeAcces: code, role }),
    });
    const data = await res.json();
    if (!res.ok) return setErreur(data.error ?? "Code invalide.");
    setProjet(data.project);
  };

  if (projet) {
    return (
      <main className="mx-auto max-w-xl px-6 py-10">
        <BackButton href={`/college/quetes/metiers/${params.slug}`} />
        <p className="text-xs uppercase tracking-wide text-espace-muted">Studio</p>
        <h1 className="mt-1 text-2xl font-bold text-espace-ink">{projet.titre}</h1>
        <p className="mt-2 text-sm text-espace-muted">
          Code d'accès à partager avec l'équipe :{" "}
          <span className="font-mono font-semibold text-espace-ink">{projet.codeAcces}</span>
        </p>

        {/* Phases du projet */}
        <div className="mt-6 flex items-center gap-2">
          {PHASES.map((phase, i) => {
            const active = projet.phase === phase;
            return (
              <div key={phase} className="flex items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    active
                      ? "bg-espace-primary text-white"
                      : "bg-espace-surface text-espace-muted"
                  }`}
                >
                  {i + 1}. {PHASE_LABELS[phase]}
                </span>
              </div>
            );
          })}
        </div>

        <h2 className="mt-6 text-sm font-semibold uppercase tracking-wide text-espace-muted">
          Équipe
        </h2>
        <div className="mt-3 flex flex-col gap-2">
          {projet.membres.map((m: any) => (
            <div
              key={m.id}
              className="flex items-center justify-between rounded-lg border border-espace-border bg-white px-4 py-3"
            >
              <span className="text-espace-ink">
                {m.eleve?.prenom} {m.eleve?.nom}
              </span>
              <span className="text-sm text-espace-muted">
                {ROLES.find((r) => r.valeur === m.role)?.label}
              </span>
            </div>
          ))}
        </div>

        <InviterCommunaute
          message={`Rejoins mon équipe Studio « ${projet.titre} » ! Va dans Quêtes, choisis un métier, mode Studio, puis « Rejoindre une équipe » avec le code : ${projet.codeAcces}`}
        />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-10">
      <BackButton href={`/college/quetes/metiers/${params.slug}`} />
      <p className="text-xs uppercase tracking-wide text-espace-muted">Mode Studio</p>
      <h1 className="mt-1 text-2xl font-bold text-espace-ink">Projet d'équipe</h1>

      {erreur && (
        <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{erreur}</div>
      )}

      {mode === "choix" && (
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => setMode("creer")}
            className="rounded-lg border border-espace-border bg-white p-4 text-left font-medium text-espace-ink transition hover:border-espace-primary"
          >
            Créer une équipe
          </button>
          <button
            onClick={() => setMode("rejoindre")}
            className="rounded-lg border border-espace-border bg-white p-4 text-left font-medium text-espace-ink transition hover:border-espace-primary"
          >
            Rejoindre une équipe avec un code
          </button>

          {projetsOuverts.length > 0 && (
            <div className="mt-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-espace-muted">
                Projets ouverts — rejoins une équipe en un clic
              </h2>
              <div className="mt-3 flex flex-col gap-2">
                {projetsOuverts.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setCode(p.codeAcces);
                      setMode("rejoindre");
                    }}
                    className="rounded-lg border border-espace-border bg-white p-4 text-left transition hover:border-espace-primary"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-espace-ink">{p.titre}</p>
                      <span className="rounded-full bg-espace-surface px-2.5 py-0.5 text-xs font-medium text-espace-primary">
                        {p.membres.length} membre{p.membres.length > 1 ? "s" : ""}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-espace-muted">
                      Équipe : {p.membres.map((m: any) => m.prenom).join(", ") || "—"}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {(mode === "creer" || mode === "rejoindre") && (
        <div className="mt-6 flex flex-col gap-4">
          {mode === "creer" && (
            <div>
              <label className="text-sm font-medium text-espace-ink">Nom du projet</label>
              <input
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                placeholder="Ex : Site pour un restaurant"
                className="mt-1 w-full rounded-lg border border-espace-border px-4 py-3 text-espace-ink"
              />
            </div>
          )}

          {mode === "rejoindre" && (
            <div>
              <label className="text-sm font-medium text-espace-ink">Code d'accès</label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Ex : A1B2C3"
                className="mt-1 w-full rounded-lg border border-espace-border px-4 py-3 font-mono text-espace-ink"
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-espace-ink">Ton rôle</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 w-full rounded-lg border border-espace-border px-4 py-3 text-espace-ink"
            >
              {ROLES.map((r) => (
                <option key={r.valeur} value={r.valeur}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={mode === "creer" ? creerProjet : rejoindreProjet}
            disabled={mode === "creer" ? !titre : !code}
            className="rounded-lg bg-espace-primary px-5 py-3 font-medium text-white transition hover:bg-espace-primaryDark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {mode === "creer" ? "Créer le projet" : "Rejoindre le projet"}
          </button>
        </div>
      )}
    </main>
  );
}
