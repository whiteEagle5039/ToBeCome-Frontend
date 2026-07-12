"use client";

import { useEffect, useState } from "react";
import { Send, MessageCircleMore, Mail, Smartphone, History } from "lucide-react";
import { TopBar } from "@/components/etablissement/TopBar";
import { EmptyState } from "@/components/etablissement/EmptyState";
import { Skeleton } from "@/components/etablissement/Skeleton";
import { Badge } from "@/components/etablissement/Badge";
import type { CanalEnvoi, EnvoiAcces } from "@/types/etablissement"
import { fetchEnvoiHistorique, sendAccesParents } from "@/lib/api/etablissement"

const CANAUX: { id: CanalEnvoi; label: string; icon: typeof Smartphone }[] = [
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircleMore },
  { id: "sms", label: "SMS", icon: Smartphone },
  { id: "email", label: "Email", icon: Mail },
];

export default function CommunicationPage() {
  const [historique, setHistorique] = useState<EnvoiAcces[] | null>(null);
  const [canalChoisi, setCanalChoisi] = useState<CanalEnvoi>("whatsapp");
  const [cible, setCible] = useState("");

  useEffect(() => {
    fetchEnvoiHistorique().then(setHistorique).catch(() => setHistorique([]));
  }, []);

  function envoyerAcces() {
    sendAccesParents({ classeId: cible || undefined, canal: canalChoisi })
      .then(() => fetchEnvoiHistorique().then(setHistorique))
      .catch(() => {});
  }

  return (
    <>
      <TopBar title="Communication" subtitle="Diffusion des accès et suivi des envois aux parents" />

      <div className="px-6 py-6 md:px-8">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-slate-800">Envoyer les accès parents</h2>

          <div className="grid gap-4 md:grid-cols-[1fr_auto]">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">
                Élèves / classe concernée
              </label>
              <input
                value={cible}
                onChange={(e) => setCible(e.target.value)}
                placeholder="Sélectionner une classe ou des élèves…"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0F766E]"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Canal</label>
              <div className="flex gap-2">
                {CANAUX.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setCanalChoisi(id)}
                    className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition ${
                      canalChoisi === id
                        ? "border-[#0F766E] bg-[#0F766E]/10 text-[#0F766E]"
                        : "border-slate-200 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={envoyerAcces}
            className="mt-4 flex items-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2 text-sm font-medium text-white hover:bg-[#0c5f59]"
          >
            <Send className="h-4 w-4" />
            Envoyer les accès
          </button>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
            <History className="h-4 w-4 text-[#0F766E]" />
            Historique des envois
          </h2>

          {historique === null ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          ) : historique.length === 0 ? (
            <EmptyState
              icon={History}
              title="Aucun envoi pour le moment"
              description="Chaque envoi d'accès parent apparaîtra ici, avec le canal utilisé et son statut."
            />
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-2 py-2">Élève</th>
                  <th className="px-2 py-2">Canal</th>
                  <th className="px-2 py-2">Date</th>
                  <th className="px-2 py-2">Statut</th>
                </tr>
              </thead>
              <tbody>
                {historique.map((h) => (
                  <tr key={h.id} className="border-b border-slate-50">
                    <td className="px-2 py-2.5 font-medium text-slate-700">{h.eleveNom}</td>
                    <td className="px-2 py-2.5 capitalize text-slate-500">{h.canal}</td>
                    <td className="px-2 py-2.5 text-slate-500">
                      {new Date(h.date).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-2 py-2.5">
                      <Badge
                        label={h.statut === "envoye" ? "Envoyé" : h.statut === "echec" ? "Échec" : "En attente"}
                        tone={h.statut === "envoye" ? "success" : h.statut === "echec" ? "danger" : "warning"}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
