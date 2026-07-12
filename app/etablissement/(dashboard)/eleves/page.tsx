"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Upload, Download, Users, ChevronRight } from "lucide-react";
import { TopBar } from "@/components/etablissement/TopBar";
import { EmptyState } from "@/components/etablissement/EmptyState";
import { Skeleton } from "@/components/etablissement/Skeleton";
import { Badge } from "@/components/etablissement/Badge";
import { Modal } from "@/components/etablissement/Modal";
import type { Classe, Eleve, StatutEleve } from "@/types/etablissement"
import { fetchClasses, fetchEleves } from "@/lib/api/etablissement"

export default function ElevesPage() {
  const [eleves, setEleves] = useState<Eleve[] | null>(null);
  const [classes, setClasses] = useState<Classe[]>([]);
  const [search, setSearch] = useState("");
  const [classeFiltre, setClasseFiltre] = useState<string>("toutes");
  const [statutFiltre, setStatutFiltre] = useState<StatutEleve | "tous">("tous");
  const [selectionnes, setSelectionnes] = useState<Set<string>>(new Set());
  const [eleveOuvert, setEleveOuvert] = useState<Eleve | null>(null);

  useEffect(() => {
    fetchEleves().then(setEleves).catch(() => setEleves([]));
    fetchClasses().then(setClasses).catch(() => setClasses([]));
  }, []);

  const elevesFiltres = useMemo(() => {
    if (!eleves) return [];
    return eleves.filter((e) => {
      const matchSearch =
        !search ||
        `${e.prenom} ${e.nom} ${e.matricule}`.toLowerCase().includes(search.toLowerCase());
      const matchClasse = classeFiltre === "toutes" || e.classeId === classeFiltre;
      const matchStatut = statutFiltre === "tous" || e.statut === statutFiltre;
      return matchSearch && matchClasse && matchStatut;
    });
  }, [eleves, search, classeFiltre, statutFiltre]);

  function toggleSelection(id: string) {
    setSelectionnes((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selectionnes.size === elevesFiltres.length) {
      setSelectionnes(new Set());
    } else {
      setSelectionnes(new Set(elevesFiltres.map((e) => e.id)));
    }
  }

  return (
    <>
      <TopBar title="Élèves" subtitle={`${eleves?.length ?? "…"} élève(s) inscrit(s)`} />

      <div className="px-6 py-6 md:px-8">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un élève, un matricule…"
                className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-[#0F766E]"
              />
            </div>

            <select
              value={classeFiltre}
              onChange={(e) => setClasseFiltre(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 outline-none focus:border-[#0F766E]"
            >
              <option value="toutes">Toutes les classes</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nom}
                </option>
              ))}
            </select>

            <select
              value={statutFiltre}
              onChange={(e) => setStatutFiltre(e.target.value as StatutEleve | "tous")}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 outline-none focus:border-[#0F766E]"
            >
              <option value="tous">Tous les statuts</option>
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
              <Upload className="h-4 w-4" /> Importer
            </button>
            <button className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
              <Download className="h-4 w-4" /> Exporter
            </button>
          </div>
        </div>

        {selectionnes.size > 0 && (
          <div className="mb-4 flex items-center justify-between rounded-xl bg-[#0F766E]/10 px-4 py-2.5 text-sm text-[#0F766E]">
            <span>{selectionnes.size} élève(s) sélectionné(s)</span>
            <div className="flex gap-3">
              <button className="font-medium hover:underline">Envoyer les accès</button>
              <button className="font-medium hover:underline">Exporter la sélection</button>
            </div>
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          {eleves === null ? (
            <div className="space-y-3 p-5">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : elevesFiltres.length === 0 ? (
            <EmptyState
              icon={Users}
              title="Aucun élève trouvé"
              description="Importez votre liste d'élèves ou générez des matricules pour commencer à peupler cet espace."
              actionLabel="Importer des élèves"
              onAction={() => {}}
            />
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectionnes.size === elevesFiltres.length}
                      onChange={toggleAll}
                    />
                  </th>
                  <th className="px-4 py-3">Élève</th>
                  <th className="px-4 py-3">Matricule</th>
                  <th className="px-4 py-3">Classe</th>
                  <th className="px-4 py-3">RIASEC</th>
                  <th className="px-4 py-3">Progression</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {elevesFiltres.map((e) => (
                  <tr key={e.id} className="border-b border-slate-50 hover:bg-slate-50/60">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectionnes.has(e.id)}
                        onChange={() => toggleSelection(e.id)}
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {e.prenom} {e.nom}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{e.matricule}</td>
                    <td className="px-4 py-3 text-slate-500">{e.classeNom}</td>
                    <td className="px-4 py-3">
                      <Badge
                        label={e.riasecComplete ? "Complété" : "En attente"}
                        tone={e.riasecComplete ? "success" : "warning"}
                      />
                    </td>
                    <td className="px-4 py-3 text-slate-500">{e.progressionPct}%</td>
                    <td className="px-4 py-3">
                      <Badge
                        label={e.statut === "actif" ? "Actif" : "Inactif"}
                        tone={e.statut === "actif" ? "success" : "neutral"}
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setEleveOuvert(e)}
                        className="text-slate-400 hover:text-[#0F766E]"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal
        open={!!eleveOuvert}
        onClose={() => setEleveOuvert(null)}
        title={eleveOuvert ? `${eleveOuvert.prenom} ${eleveOuvert.nom}` : ""}
      >
        {eleveOuvert && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-slate-400">Matricule</p>
                <p className="font-medium text-slate-700">{eleveOuvert.matricule}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Classe</p>
                <p className="font-medium text-slate-700">{eleveOuvert.classeNom}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Badges obtenus</p>
                <p className="font-medium text-slate-700">{eleveOuvert.badgesObtenus}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Inscrit le</p>
                <p className="font-medium text-slate-700">
                  {new Date(eleveOuvert.dateInscription).toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-3">
              <p className="mb-1 text-xs font-semibold text-slate-500">Responsable</p>
              {eleveOuvert.responsable ? (
                <p className="text-slate-700">
                  {eleveOuvert.responsable.nom} · {eleveOuvert.responsable.telephone}
                </p>
              ) : (
                <p className="text-slate-400">Aucun responsable renseigné</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
