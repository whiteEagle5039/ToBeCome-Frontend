"use client";

import { useEffect, useState } from "react";
import { Check, CreditCard, FileDown, RefreshCcw } from "lucide-react";
import { TopBar } from "@/components/etablissement/TopBar";
import { EmptyState } from "@/components/etablissement/EmptyState";
import { Skeleton } from "@/components/etablissement/Skeleton";
import { Badge } from "@/components/etablissement/Badge";
import type { Abonnement, FormuleAbonnement } from "@/types/etablissement"
import { fetchAbonnement, souscrireAbonnement } from "@/lib/api/etablissement"

const LABEL_FORMULE: Record<FormuleAbonnement, string> = {
  decouverte: "Découverte",
  standard: "Standard",
  etablissement_plus: "Établissement+",
};

const FORMULES: Array<{
  id: FormuleAbonnement;
  nom: string;
  prix: string;
  licences: string;
  avantages: string[];
  misEnAvant?: boolean;
}> = [
  {
    id: "decouverte",
    nom: "Découverte",
    prix: "Gratuit",
    licences: "50 licences élèves",
    avantages: [
      "Matricules et suivi des élèves",
      "Tests RIASEC et quêtes métiers",
      "Tableau de bord de base",
    ],
  },
  {
    id: "standard",
    nom: "Standard",
    prix: "25 000 FCFA / an",
    licences: "200 licences élèves",
    misEnAvant: true,
    avantages: [
      "Tout Découverte",
      "Site vitrine publié sur To Be.Come",
      "Rapports et communication aux parents",
    ],
  },
  {
    id: "etablissement_plus",
    nom: "Établissement+",
    prix: "60 000 FCFA / an",
    licences: "1 000 licences élèves",
    avantages: [
      "Tout Standard",
      "Import/export des élèves en masse",
      "Accompagnement prioritaire",
    ],
  },
];

export default function AbonnementPage() {
  const [abonnement, setAbonnement] = useState<Abonnement | null | undefined>(undefined);
  const [souscription, setSouscription] = useState<FormuleAbonnement | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchAbonnement().then(setAbonnement).catch(() => setAbonnement(null));
  }, []);

  async function choisirFormule(formule: FormuleAbonnement) {
    setSouscription(formule);
    setMessage(null);
    try {
      const maj = await souscrireAbonnement(formule);
      setAbonnement(maj);
      setMessage(
        `Formule ${LABEL_FORMULE[formule]} activée pour un an. Votre site vitrine peut maintenant être publié depuis les paramètres.`
      );
    } catch {
      setMessage("La souscription a échoué. Réessayez.");
    } finally {
      setSouscription(null);
    }
  }

  function changerFormule() {
    document.getElementById("formules")?.scrollIntoView({ behavior: "smooth" });
  }

  const chargement = abonnement === undefined;

  return (
    <>
      <TopBar title="Abonnement" subtitle="Formule, licences et facturation" />

      <div className="px-6 py-6 md:px-8">
        {chargement ? (
          <Skeleton className="h-40 w-full" />
        ) : !abonnement ? (
          <EmptyState
            icon={CreditCard}
            title="Aucun abonnement actif"
            description="Choisissez une formule pour activer les licences de votre établissement."
            actionLabel="Choisir une formule"
            onAction={changerFormule}
          />
        ) : (
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Formule active
                </p>
                <p className="text-xl font-semibold text-slate-900">
                  {LABEL_FORMULE[abonnement.formule]}
                </p>
              </div>
              <button
                onClick={changerFormule}
                className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                <RefreshCcw className="h-4 w-4" />
                Changer de formule
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-400">Licences utilisées</p>
                <p className="mt-1 text-lg font-semibold text-slate-800">
                  {abonnement.licencesUtilisees} / {abonnement.licencesTotal}
                </p>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-[#0F766E]"
                    style={{
                      width: `${Math.min(
                        100,
                        (abonnement.licencesUtilisees / Math.max(1, abonnement.licencesTotal)) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-400">Date d'expiration</p>
                <p className="mt-1 text-lg font-semibold text-slate-800">
                  {new Date(abonnement.dateExpiration).toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>
          </div>
        )}

        {message && (
          <div className="mt-4 rounded-2xl border border-[#0F766E]/20 bg-[#DFF6F3] px-5 py-4 text-sm text-[#0F766E]">
            {message}
          </div>
        )}

        {/* Choix / changement de formule */}
        <div id="formules" className="mt-6">
          <h2 className="text-sm font-semibold text-slate-800">
            {abonnement ? "Changer de formule" : "Choisir une formule"}
          </h2>
          <div className="mt-3 grid gap-4 md:grid-cols-3">
            {FORMULES.map((f) => {
              const active = abonnement?.formule === f.id;
              return (
                <div
                  key={f.id}
                  className={`flex flex-col rounded-2xl border bg-white p-5 shadow-sm ${
                    f.misEnAvant ? "border-[#FFCB05] ring-2 ring-[#FFCB05]/40" : "border-slate-100"
                  }`}
                >
                  {f.misEnAvant && (
                    <span className="mb-2 w-fit rounded-full bg-[#FFCB05] px-2.5 py-0.5 text-[11px] font-bold text-slate-900">
                      RECOMMANDÉ
                    </span>
                  )}
                  <p className="text-base font-bold text-slate-900">{f.nom}</p>
                  <p className="mt-1 text-xl font-extrabold text-[#0F766E]">{f.prix}</p>
                  <p className="text-xs text-slate-500">{f.licences}</p>
                  <ul className="mt-3 flex-1 space-y-1.5">
                    {f.avantages.map((a) => (
                      <li key={a} className="flex items-start gap-1.5 text-xs text-slate-600">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0F766E]" />
                        {a}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => choisirFormule(f.id)}
                    disabled={active || souscription !== null}
                    className={`mt-4 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                      active
                        ? "cursor-default bg-slate-100 text-slate-400"
                        : "bg-[#0F766E] text-white hover:bg-[#0c5f59] disabled:opacity-60"
                    }`}
                  >
                    {active
                      ? "Formule actuelle"
                      : souscription === f.id
                        ? "Activation…"
                        : "Choisir cette formule"}
                  </button>
                </div>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-slate-400">
            L'activation est immédiate ; la facture correspondante apparaît ci-dessous
            (règlement par mobile money ou virement auprès de l'équipe To Be.Come).
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-slate-800">Factures</h2>

          {chargement ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-9 w-full" />
              ))}
            </div>
          ) : !abonnement || abonnement.factures.length === 0 ? (
            <EmptyState
              icon={FileDown}
              title="Aucune facture disponible"
              description="Vos factures apparaîtront ici dès le premier cycle de facturation."
            />
          ) : (
            <ul className="divide-y divide-slate-50">
              {abonnement.factures.map((f) => (
                <li key={f.id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <p className="font-medium text-slate-700">{f.periode}</p>
                    <p className="text-xs text-slate-400">{f.montantFcfa.toLocaleString("fr-FR")} FCFA</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      label={f.statut === "payee" ? "Payée" : "En attente"}
                      tone={f.statut === "payee" ? "success" : "warning"}
                    />
                    <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-[#0F766E]">
                      <FileDown className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
