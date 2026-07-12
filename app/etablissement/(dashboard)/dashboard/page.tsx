"use client";

import { useEffect, useState } from "react";
import { Users, UserX, TrendingUp, Radio, Compass, Briefcase } from "lucide-react";
import { TopBar } from "@/components/etablissement/TopBar";
import { StatCard } from "@/components/etablissement/StatCard";
import { EmptyState } from "@/components/etablissement/EmptyState";
import { Skeleton } from "@/components/etablissement/Skeleton";
import type { DashboardOverview } from "@/types/etablissement"
import { fetchDashboardOverview } from "@/lib/api/etablissement"

export default function DashboardPage() {
  const [data, setData] = useState<DashboardOverview | null>(null);

  useEffect(() => {
    let active = true;
    fetchDashboardOverview()
      .then(setData)
      .catch(() =>
        setData({
          elevesActifs: 0,
          elevesInactifs: 0,
          progressionMoyennePct: 0,
          domainesTopExplores: [],
          metiersTopConsultes: [],
          derniereMiseAJour: new Date().toISOString(),
        }),
      );
    return () => {
      active = false;
    };
  }, []);

  const hasDomaines = (data?.domainesTopExplores.length ?? 0) > 0;
  const hasMetiers = (data?.metiersTopConsultes.length ?? 0) > 0;

  return (
    <>
      <TopBar title="Tableau de bord" subtitle="Vue d'ensemble de votre établissement" />

      <div className="px-6 py-6 md:px-8">
        <div className="mb-4 flex items-center gap-2 text-xs font-medium text-slate-400">
          <Radio className="h-3.5 w-3.5 text-emerald-500" />
          {data
            ? `Mis à jour à ${new Date(data.derniereMiseAJour).toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}`
            : "Chargement des indicateurs en temps réel…"}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Users} label="Élèves actifs" value={data?.elevesActifs ?? null} />
          <StatCard icon={UserX} label="Élèves inactifs" value={data?.elevesInactifs ?? null} accent="yellow" />
          <StatCard
            icon={TrendingUp}
            label="Progression moyenne"
            value={data?.progressionMoyennePct ?? null}
            suffix="%"
          />
          <StatCard
            icon={Compass}
            label="Domaines suivis"
            value={data?.domainesTopExplores.length ?? null}
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
              <Compass className="h-4 w-4 text-[#0F766E]" />
              Domaines les plus explorés
            </h2>

            {data === null ? (
              <div className="space-y-3">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
              </div>
            ) : !hasDomaines ? (
              <EmptyState
                icon={Compass}
                title="Aucune exploration enregistrée"
                description="Les domaines les plus consultés par vos élèves apparaîtront ici dès qu'ils commenceront à explorer les métiers."
              />
            ) : (
              <ul className="space-y-3">
                {data.domainesTopExplores.map((d) => (
                  <li key={d.nom} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{d.nom}</span>
                    <span className="font-semibold text-slate-900">{d.nbExplorations}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
              <Briefcase className="h-4 w-4 text-[#0F766E]" />
              Métiers les plus consultés
            </h2>

            {data === null ? (
              <div className="space-y-3">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
              </div>
            ) : !hasMetiers ? (
              <EmptyState
                icon={Briefcase}
                title="Aucun métier consulté"
                description="Le classement des métiers les plus regardés par vos élèves s'affichera dès les premières activités."
              />
            ) : (
              <ul className="space-y-3">
                {data.metiersTopConsultes.map((m) => (
                  <li key={m.nom} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="text-slate-700">{m.nom}</p>
                      <p className="text-xs text-slate-400">{m.domaine}</p>
                    </div>
                    <span className="font-semibold text-slate-900">{m.nbConsultations}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
