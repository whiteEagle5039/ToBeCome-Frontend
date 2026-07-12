"use client";

import { useEffect, useState } from "react";
import { FileText, Download, MessageCircleMore, Share2 } from "lucide-react";
import { TopBar } from "@/components/etablissement/TopBar";
import { EmptyState } from "@/components/etablissement/EmptyState";
import { Skeleton } from "@/components/etablissement/Skeleton";
import { Modal } from "@/components/etablissement/Modal";
import type { Rapport } from "@/types/etablissement"
import { fetchRapports, generateRapport, shareRapportWhatsApp } from "@/lib/api/etablissement"

export default function RapportsPage() {
  const [rapports, setRapports] = useState<Rapport[] | null>(null);
  const [partageOuvert, setPartageOuvert] = useState<Rapport | null>(null);
  const [numeroSaisi, setNumeroSaisi] = useState("");

  useEffect(() => {
    fetchRapports().then(setRapports).catch(() => setRapports([]));
  }, []);

  function genererRapportClasse() {
    // TODO: déclencher la génération du rapport classe (jsPDF / WeasyPrint)
    console.log("Génération d'un rapport classe");
  }

  function genererRapportEleve() {
    // TODO: déclencher la génération du rapport élève
    console.log("Génération d'un rapport élève");
  }

  function partagerSurWhatsapp() {
    // TODO: appeler l'API de partage WhatsApp avec le numéro connu ou saisi
    console.log("Partage WhatsApp", { rapport: partageOuvert?.id, numeroSaisi });
    setPartageOuvert(null);
  }

  return (
    <>
      <TopBar title="Rapports" subtitle="Génération et partage des rapports d'orientation" />

      <div className="px-6 py-6 md:px-8">
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <button
            onClick={genererRapportClasse}
            className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 text-left shadow-sm hover:border-[#0F766E]/40"
          >
            <div>
              <p className="text-sm font-semibold text-slate-800">Rapport global par classe</p>
              <p className="text-xs text-slate-400">Statistiques agrégées, format PDF</p>
            </div>
            <FileText className="h-6 w-6 text-[#0F766E]" />
          </button>

          <button
            onClick={genererRapportEleve}
            className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 text-left shadow-sm hover:border-[#0F766E]/40"
          >
            <div>
              <p className="text-sm font-semibold text-slate-800">Rapport individuel par élève</p>
              <p className="text-xs text-slate-400">Profil RIASEC et parcours, format PDF</p>
            </div>
            <FileText className="h-6 w-6 text-[#0F766E]" />
          </button>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-slate-800">Rapports générés</h2>

          {rapports === null ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : rapports.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="Aucun rapport généré"
              description="Générez un rapport de classe ou d'élève pour le retrouver ici, le télécharger ou le partager aux parents."
            />
          ) : (
            <ul className="divide-y divide-slate-50">
              {rapports.map((r) => (
                <li key={r.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{r.cibleNom}</p>
                    <p className="text-xs text-slate-400">
                      {r.type === "classe" ? "Rapport de classe" : "Rapport individuel"} ·{" "}
                      {new Date(r.dateGeneration).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-[#0F766E]">
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setPartageOuvert(r)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-[#0F766E]"
                    >
                      <MessageCircleMore className="h-4 w-4" />
                    </button>
                    <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-[#0F766E]">
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Modal
        open={!!partageOuvert}
        onClose={() => setPartageOuvert(null)}
        title="Partager sur WhatsApp"
        footer={
          <>
            <button
              onClick={() => setPartageOuvert(null)}
              className="rounded-xl px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50"
            >
              Annuler
            </button>
            <button
              onClick={partagerSurWhatsapp}
              className="rounded-xl bg-[#0F766E] px-4 py-2 text-sm font-medium text-white hover:bg-[#0c5f59]"
            >
              Envoyer
            </button>
          </>
        }
      >
        <p className="mb-3 text-sm text-slate-500">
          Numéro du parent inconnu pour ce rapport. Saisissez-le pour l'envoyer directement.
        </p>
        <input
          value={numeroSaisi}
          onChange={(e) => setNumeroSaisi(e.target.value)}
          placeholder="+229 …"
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0F766E]"
        />
      </Modal>
    </>
  );
}
