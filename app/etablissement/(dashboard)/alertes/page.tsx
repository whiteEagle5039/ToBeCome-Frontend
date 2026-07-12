"use client";

import { useEffect, useMemo, useState } from "react";
import { BellRing, UserX, ShieldAlert, Send } from "lucide-react";
import { TopBar } from "@/components/etablissement/TopBar";
import { EmptyState } from "@/components/etablissement/EmptyState";
import { Skeleton } from "@/components/etablissement/Skeleton";
import type { Alerte, TypeAlerte } from "@/types/etablissement"
import { fetchAlertes, sendRappel } from "@/lib/api/etablissement"

const FILTRES: { id: TypeAlerte | "toutes"; label: string }[] = [
  { id: "toutes", label: "Toutes" },
  { id: "inactivite", label: "Élèves inactifs" },
  { id: "bloque", label: "Parcours bloqués" },
];

export default function AlertesPage() {
  const [alertes, setAlertes] = useState<Alerte[] | null>(null);
  const [filtre, setFiltre] = useState<TypeAlerte | "toutes">("toutes");

  useEffect(() => {
    fetchAlertes().then(setAlertes).catch(() => setAlertes([]));
  }, []);

  const alertesFiltrees = useMemo(() => {
    if (!alertes) return [];
    return filtre === "toutes" ? alertes : alertes.filter((a) => a.type === filtre);
  }, [alertes, filtre]);

  function envoyerRappel(alerteId: string) {
    sendRappel(alerteId).then(() => fetchAlertes().then(setAlertes));
  }

  return (
    <>
      <TopBar title="Alertes & rappels" subtitle="Suivi des élèves inactifs ou bloqués dans leur parcours" />

      <div className="px-6 py-6 md:px-8">
        <div className="mb-4 flex gap-2">
          {FILTRES.map((f) => (
            <button
              key={f.id}
              onClick={() => setFiltre(f.id)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                filtre === f.id
                  ? "bg-[#0F766E] text-white"
                  : "bg-white text-slate-500 ring-1 ring-inset ring-slate-200 hover:bg-slate-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {alertes === null ? (
            [...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
          ) : alertesFiltrees.length === 0 ? (
            <EmptyState
              icon={BellRing}
              title="Aucune alerte active"
              description="Dès qu'un élève sera inactif ou bloqué dans son parcours, il apparaîtra ici pour un rappel ciblé."
            />
          ) : (
            alertesFiltrees.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      a.type === "inactivite" ? "bg-[#FFCB05]/20 text-[#8a6d00]" : "bg-rose-50 text-rose-600"
                    }`}
                  >
                    {a.type === "inactivite" ? (
                      <UserX className="h-5 w-5" />
                    ) : (
                      <ShieldAlert className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{a.eleveNom}</p>
                    <p className="text-xs text-slate-400">
                      {a.classeNom} · {a.message}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => envoyerRappel(a.id)}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  Envoyer un rappel
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
