"use client";

import { useEffect, useState } from "react";
import { KeyRound, Plus, Layers, Upload, Loader2, XCircle } from "lucide-react";
import { TopBar } from "@/components/etablissement/TopBar";
import { EmptyState } from "@/components/etablissement/EmptyState";
import { Skeleton } from "@/components/etablissement/Skeleton";
import { Badge } from "@/components/etablissement/Badge";
import { Modal } from "@/components/etablissement/Modal";
import type { Matricule } from "@/types/etablissement"
import { fetchMatricules, generateMatricules } from "@/lib/api/etablissement"
import { getApiErrorMessage } from "@/lib/api/client"

export default function MatriculesPage() {
  const [matricules, setMatricules] = useState<Matricule[] | null>(null);
  const [modalLot, setModalLot] = useState(false);
  const [quantite, setQuantite] = useState(10);
  const [generation, setGeneration] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    fetchMatricules().then(setMatricules).catch(() => setMatricules([]));
  }, []);

  async function genererUnitaire() {
    setErreur(null);
    setGeneration(true);
    try {
      const generes = await generateMatricules({ count: 1 });
      setMatricules((prev) => [...generes, ...(prev ?? [])]);
    } catch (err) {
      setErreur(getApiErrorMessage(err, "La génération du matricule a échoué."));
    } finally {
      setGeneration(false);
    }
  }

  async function genererEnLot() {
    setErreur(null);
    setGeneration(true);
    try {
      const generes = await generateMatricules({ count: quantite });
      setMatricules((prev) => [...generes, ...(prev ?? [])]);
      setModalLot(false);
    } catch (err) {
      setErreur(getApiErrorMessage(err, "La génération des matricules a échoué."));
    } finally {
      setGeneration(false);
    }
  }

  const utilises = matricules?.filter((m) => m.statut === "utilise").length ?? 0;
  const total = matricules?.length ?? 0;

  return (
    <>
      <TopBar
        title="Matricules"
        subtitle={matricules ? `${utilises} / ${total} matricules utilisés` : undefined}
      />

      <div className="px-6 py-6 md:px-8">
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={genererUnitaire}
            disabled={generation}
            className="flex items-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2 text-sm font-medium text-white hover:bg-[#0c5f59] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {generation ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Générer un matricule
          </button>
          <button
            onClick={() => setModalLot(true)}
            disabled={generation}
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Layers className="h-4 w-4" /> Générer en lot
          </button>
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
            <Upload className="h-4 w-4" /> Importer des matricules existants
          </button>
        </div>

        {erreur && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm text-rose-700">
            <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{erreur}</span>
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          {matricules === null ? (
            <div className="space-y-3 p-5">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-9 w-full" />
              ))}
            </div>
          ) : matricules.length === 0 ? (
            <EmptyState
              icon={KeyRound}
              title="Aucun matricule généré"
              description="Générez vos premiers matricules unitairement ou en lot pour permettre l'inscription de vos élèves."
              actionLabel="Générer un matricule"
              onAction={genererUnitaire}
            />
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Classe</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3">Généré le</th>
                </tr>
              </thead>
              <tbody>
                {matricules.map((m) => (
                  <tr key={m.id} className="border-b border-slate-50">
                    <td className="px-4 py-3 font-mono text-slate-700">{m.code}</td>
                    <td className="px-4 py-3 text-slate-500">{m.classeNom ?? "—"}</td>
                    <td className="px-4 py-3">
                      <Badge
                        label={m.statut === "utilise" ? "Utilisé" : "Non utilisé"}
                        tone={m.statut === "utilise" ? "success" : "neutral"}
                      />
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {new Date(m.dateGeneration).toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal
        open={modalLot}
        onClose={() => setModalLot(false)}
        title="Générer des matricules en lot"
        footer={
          <>
            <button
              onClick={() => setModalLot(false)}
              className="rounded-xl px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50"
            >
              Annuler
            </button>
            <button
              onClick={genererEnLot}
              disabled={generation || quantite < 1}
              className="flex items-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2 text-sm font-medium text-white hover:bg-[#0c5f59] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {generation && <Loader2 className="h-4 w-4 animate-spin" />} Générer
            </button>
          </>
        }
      >
        <label className="mb-1 block text-xs font-medium text-slate-500">Nombre de matricules</label>
        <input
          type="number"
          min={1}
          value={quantite}
          onChange={(e) => setQuantite(Number(e.target.value))}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0F766E]"
        />
      </Modal>
    </>
  );
}
