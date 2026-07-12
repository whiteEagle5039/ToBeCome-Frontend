"use client";

import { useEffect, useState } from "react";
import { Image as ImageIcon, Link as LinkIcon, Copy, KeyRound, Plus, X } from "lucide-react";
import { TopBar } from "@/components/etablissement/TopBar";
import { Skeleton } from "@/components/etablissement/Skeleton";
import type { ParametresEtablissement } from "@/types/etablissement"
import {
  fetchParametres,
  updateParametres,
  changeEtablissementPassword,
  updatePagePublique,
} from "@/lib/api/etablissement"

export default function ParametresPage() {
  const [params, setParams] = useState<ParametresEtablissement | null>(null);
  const [nouvelleFiliere, setNouvelleFiliere] = useState("");
  const [nouvelExamen, setNouvelExamen] = useState({ examen: "", annee: "", taux: "" });
  const [motDePasse, setMotDePasse] = useState({ actuel: "", nouveau: "", confirmation: "" });
  const [enregistrement, setEnregistrement] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageMdp, setMessageMdp] = useState<string | null>(null);

  useEffect(() => {
    fetchParametres().then(setParams);
  }, []);

  function majChamp<K extends keyof ParametresEtablissement>(champ: K, valeur: ParametresEtablissement[K]) {
    setParams((prev) => (prev ? { ...prev, [champ]: valeur } : prev));
  }

  function ajouterFiliere() {
    if (!nouvelleFiliere.trim() || !params) return;
    majChamp("filieres", [...params.filieres, nouvelleFiliere.trim()]);
    setNouvelleFiliere("");
  }

  function retirerFiliere(index: number) {
    if (!params) return;
    majChamp(
      "filieres",
      params.filieres.filter((_, i) => i !== index)
    );
  }

  function ajouterExamen() {
    if (!params) return;
    const taux = Number(nouvelExamen.taux);
    if (!nouvelExamen.examen.trim() || !nouvelExamen.annee.trim() || Number.isNaN(taux)) return;
    majChamp("resultatsExamens", [
      ...(params.resultatsExamens ?? []),
      {
        examen: nouvelExamen.examen.trim().toUpperCase(),
        annee: nouvelExamen.annee.trim(),
        tauxReussite: Math.min(100, Math.max(0, Math.round(taux))),
      },
    ]);
    setNouvelExamen({ examen: "", annee: "", taux: "" });
  }

  function retirerExamen(index: number) {
    if (!params) return;
    majChamp(
      "resultatsExamens",
      (params.resultatsExamens ?? []).filter((_, i) => i !== index)
    );
  }

  async function enregistrer() {
    if (!params) return;
    setEnregistrement(true);
    setMessage(null);
    try {
      await updateParametres(params);
      await updatePagePublique({
        filieres: params.filieres,
        resultatsExamens: params.resultatsExamens ?? [],
        isPublished: true,
      });
      setMessage("Modifications enregistrées — votre page publique est à jour.");
    } catch {
      setMessage("Impossible d'enregistrer. Réessayez.");
    } finally {
      setEnregistrement(false);
    }
  }

  async function changerMotDePasse() {
    setMessageMdp(null);
    if (motDePasse.nouveau.length < 8) {
      setMessageMdp("Le nouveau mot de passe doit faire au moins 8 caractères.");
      return;
    }
    if (motDePasse.nouveau !== motDePasse.confirmation) {
      setMessageMdp("La confirmation ne correspond pas.");
      return;
    }
    try {
      await changeEtablissementPassword(motDePasse.actuel, motDePasse.nouveau);
      setMessageMdp("Mot de passe modifié.");
      setMotDePasse({ actuel: "", nouveau: "", confirmation: "" });
    } catch {
      setMessageMdp("Modification impossible — vérifiez le mot de passe actuel.");
    }
  }

  function copierLien() {
    if (params?.lienPublic) {
      navigator.clipboard?.writeText(`${window.location.origin}${params.lienPublic}`);
    }
  }

  if (!params) {
    return (
      <>
        <TopBar title="Page publique & paramètres" />
        <div className="space-y-4 px-6 py-6 md:px-8">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar title="Page publique & paramètres" subtitle="Identité et informations visibles publiquement" />

      <div className="grid grid-cols-1 gap-6 px-6 py-6 md:px-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-slate-800">Identité de l'établissement</h2>

            <div className="mb-4 flex items-center gap-4">
              {params.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={params.logoUrl}
                  alt="Logo de l'établissement"
                  className="h-16 w-16 rounded-2xl border border-slate-100 bg-white object-contain p-1"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-300">
                  <ImageIcon className="h-6 w-6" />
                </div>
              )}
              <div className="flex-1">
                <label className="mb-1 block text-xs font-medium text-slate-500">
                  Logo (adresse de l'image)
                </label>
                <input
                  value={params.logoUrl ?? ""}
                  onChange={(e) => majChamp("logoUrl", e.target.value || null)}
                  placeholder="https://exemple.com/logo.png"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0F766E]"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Nom</label>
                <input
                  value={params.nom}
                  onChange={(e) => majChamp("nom", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0F766E]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Description</label>
                <textarea
                  value={params.description}
                  onChange={(e) => majChamp("description", e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0F766E]"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-slate-800">Coordonnées</h2>
            <div className="space-y-3">
              <input
                value={params.telephone}
                onChange={(e) => majChamp("telephone", e.target.value)}
                placeholder="Téléphone"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0F766E]"
              />
              <input
                value={params.email}
                onChange={(e) => majChamp("email", e.target.value)}
                placeholder="Email"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0F766E]"
              />
              <input
                value={params.adresse}
                onChange={(e) => majChamp("adresse", e.target.value)}
                placeholder="Adresse"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0F766E]"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-slate-800">Filières proposées</h2>
            <div className="mb-3 flex flex-wrap gap-2">
              {params.filieres.map((f, i) => (
                <span
                  key={`${f}-${i}`}
                  className="flex items-center gap-1.5 rounded-full bg-[#0F766E]/10 px-3 py-1 text-xs font-medium text-[#0F766E]"
                >
                  {f}
                  <button onClick={() => retirerFiliere(i)}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {params.filieres.length === 0 && (
                <p className="text-xs text-slate-400">Aucune filière ajoutée pour le moment.</p>
              )}
            </div>
            <div className="flex gap-2">
              <input
                value={nouvelleFiliere}
                onChange={(e) => setNouvelleFiliere(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && ajouterFiliere()}
                placeholder="Ajouter une filière…"
                className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0F766E]"
              />
              <button
                onClick={ajouterFiliere}
                className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-slate-800">
              Résultats aux examens
            </h2>
            <p className="mb-3 text-xs text-slate-400">
              Taux de réussite affichés sur votre site vitrine (ex : BEPC 2025 — 92 %).
            </p>

            <div className="mb-3 space-y-2">
              {(params.resultatsExamens ?? []).map((r, i) => (
                <div
                  key={`${r.examen}-${r.annee}-${i}`}
                  className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2"
                >
                  <span className="text-sm font-medium text-slate-700">
                    {r.examen} {r.annee}
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-[#0F766E]">
                      {r.tauxReussite} %
                    </span>
                    <button onClick={() => retirerExamen(i)} className="text-slate-400 hover:text-red-500">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                </div>
              ))}
              {(params.resultatsExamens ?? []).length === 0 && (
                <p className="text-xs text-slate-400">Aucun résultat ajouté pour le moment.</p>
              )}
            </div>

            <div className="flex gap-2">
              <input
                value={nouvelExamen.examen}
                onChange={(e) => setNouvelExamen((p) => ({ ...p, examen: e.target.value }))}
                placeholder="Examen (BEPC...)"
                className="w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0F766E]"
              />
              <input
                value={nouvelExamen.annee}
                onChange={(e) => setNouvelExamen((p) => ({ ...p, annee: e.target.value }))}
                placeholder="Année"
                className="w-20 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0F766E]"
              />
              <input
                value={nouvelExamen.taux}
                onChange={(e) => setNouvelExamen((p) => ({ ...p, taux: e.target.value }))}
                placeholder="%"
                inputMode="numeric"
                className="w-16 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0F766E]"
              />
              <button
                onClick={ajouterExamen}
                className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {message && <p className="text-sm text-[#0F766E]">{message}</p>}
          <button
            onClick={enregistrer}
            disabled={enregistrement}
            className="rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0c5f59] disabled:opacity-60"
          >
            {enregistrement ? "Enregistrement…" : "Enregistrer et publier ma page"}
          </button>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
              <LinkIcon className="h-4 w-4 text-[#0F766E]" />
              Page publique
            </h2>
            <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
              <span className="flex-1 truncate text-sm text-slate-500">
                {params.lienPublic || "Lien indisponible pour le moment"}
              </span>
              <button onClick={copierLien} className="text-slate-400 hover:text-[#0F766E]">
                <Copy className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 aspect-[4/3] rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-xs text-slate-400">
              Aperçu de la page publique — se met à jour automatiquement avec vos modifications
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
              <KeyRound className="h-4 w-4 text-[#0F766E]" />
              Mot de passe administrateur
            </h2>
            <div className="space-y-3">
              <input
                type="password"
                value={motDePasse.actuel}
                onChange={(e) => setMotDePasse((p) => ({ ...p, actuel: e.target.value }))}
                placeholder="Mot de passe actuel"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0F766E]"
              />
              <input
                type="password"
                value={motDePasse.nouveau}
                onChange={(e) => setMotDePasse((p) => ({ ...p, nouveau: e.target.value }))}
                placeholder="Nouveau mot de passe"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0F766E]"
              />
              <input
                type="password"
                value={motDePasse.confirmation}
                onChange={(e) => setMotDePasse((p) => ({ ...p, confirmation: e.target.value }))}
                placeholder="Confirmer le nouveau mot de passe"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0F766E]"
              />
              {messageMdp && <p className="text-sm text-[#0F766E]">{messageMdp}</p>}
              <button
                onClick={changerMotDePasse}
                className="w-full rounded-xl border border-slate-200 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Mettre à jour le mot de passe
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
