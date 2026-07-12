"use client";

import { use, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import { useStore } from "@/lib/parent/store";
import { Brand } from "@/components/parent/Brand";
import { RiasecBars } from "@/components/parent/RiasecBars";
import { getIcon } from "@/lib/parent/icons";
import { getCareer, formatDate, formatDateTime, age } from "@/lib/parent/utils";
import { RIASEC_LABELS } from "@/lib/parent/mockData";

export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { children, hydrated } = useStore();
  const child = children.find((c) => c.id === id);

  useEffect(() => {
    document.title = child ? `Dossier — ${child.firstName} ${child.lastName}` : "Dossier";
  }, [child]);

  if (!hydrated) return null;
  if (!child) {
    return <div className="p-10 text-sm text-slate">Profil introuvable.</div>;
  }

  const recentActivity = [...child.activity].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 8);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-2xl px-6 py-10 print:px-0 print:py-0">
        <div className="mb-8 flex items-center justify-between print:hidden">
          <Link href={`/parent/enfant/${child.id}`} className="focus-ring inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 hover:underline">
            <ArrowLeft size={16} /> Retour au profil
          </Link>
          <button
            onClick={() => window.print()}
            className="focus-ring inline-flex items-center gap-2 rounded-full bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
          >
            <Printer size={16} /> Imprimer / Enregistrer en PDF
          </button>
        </div>

        <div className="flex items-center justify-between border-b border-line pb-6">
          <Brand />
          <div className="text-right text-xs text-slate">
            <p>Dossier d&apos;orientation</p>
            <p>Généré le {formatDate(new Date().toISOString())}</p>
          </div>
        </div>

        <div className="mt-6">
          <h1 className="font-display text-2xl font-semibold text-teal-950">
            {child.firstName} {child.lastName}
          </h1>
          <p className="text-sm text-slate">
            {age(child.birthDate)} ans · {child.className} · {child.school} · Matricule{" "}
            {child.matricule}
          </p>
        </div>

        <section className="mt-8">
          <h2 className="font-display text-base font-semibold text-teal-900">Profil RIASEC</h2>
          {child.riasecCompleted ? (
            <>
              <p className="mt-1 text-sm text-slate">
                Profil dominant :{" "}
                <strong>{child.riasecDominant.map((t) => RIASEC_LABELS[t]).join(" · ")}</strong>
              </p>
              <div className="mt-3">
                <RiasecBars scores={child.riasecScores} />
              </div>
            </>
          ) : (
            <p className="mt-1 text-sm text-slate">Test RIASEC non encore réalisé.</p>
          )}
        </section>

        {child.interestPoints.length > 0 && (
          <section className="mt-8">
            <h2 className="font-display text-base font-semibold text-teal-900">Points d&apos;intérêt</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink">
              {child.interestPoints.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-8 grid grid-cols-2 gap-8">
          <div>
            <h2 className="font-display text-base font-semibold text-teal-900">Métiers suggérés</h2>
            <ul className="mt-2 space-y-1 text-sm text-ink">
              {child.suggestedCareerIds.length
                ? child.suggestedCareerIds.map((cid) => <li key={cid}>{getCareer(cid)?.title}</li>)
                : <li className="text-slate">Aucun pour le moment</li>}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-base font-semibold text-teal-900">Métiers maîtrisés</h2>
            <ul className="mt-2 space-y-1 text-sm text-ink">
              {child.masteredCareerIds.length
                ? child.masteredCareerIds.map((cid) => <li key={cid}>{getCareer(cid)?.title}</li>)
                : <li className="text-slate">Aucun pour le moment</li>}
            </ul>
          </div>
        </section>

        {child.favoriteCareerIds.length > 0 && (
          <section className="mt-8">
            <h2 className="font-display text-base font-semibold text-teal-900">Favoris</h2>
            <ul className="mt-2 space-y-1 text-sm text-ink">
              {child.favoriteCareerIds.map((cid) => (
                <li key={cid}>{getCareer(cid)?.title}</li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-8 grid grid-cols-3 gap-4 rounded-2xl bg-teal-50 p-5 print:bg-transparent print:border print:border-line">
          <div>
            <p className="text-xs text-slate">Progression</p>
            <p className="font-display text-xl font-semibold text-teal-900">{child.progressPercent}%</p>
          </div>
          <div>
            <p className="text-xs text-slate">Badges</p>
            <p className="font-display text-xl font-semibold text-teal-900">{child.badges.length}</p>
          </div>
          <div>
            <p className="text-xs text-slate">Métiers explorés</p>
            <p className="font-display text-xl font-semibold text-teal-900">{child.exploredCareerIds.length}</p>
          </div>
        </section>

        {child.badges.length > 0 && (
          <section className="mt-8">
            <h2 className="font-display text-base font-semibold text-teal-900">Badges obtenus</h2>
            <ul className="mt-3 space-y-2">
              {child.badges.map((b) => {
                const Icon = getIcon(b.icon);
                return (
                  <li key={b.id} className="flex items-start gap-3 text-sm">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-yellow-100 text-yellow-700 print:border print:border-line">
                      <Icon size={14} />
                    </div>
                    <div>
                      <p className="font-medium text-ink">{b.name}</p>
                      <p className="text-xs text-slate">{b.description} · {formatDate(b.dateEarned)}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <section className="mt-8">
          <h2 className="font-display text-base font-semibold text-teal-900">
            Historique d&apos;activité récent
          </h2>
          <ul className="mt-3 space-y-2">
            {recentActivity.length ? (
              recentActivity.map((a) => (
                <li key={a.id} className="flex items-start justify-between gap-4 text-sm">
                  <span className="text-ink">{a.label}</span>
                  <span className="shrink-0 whitespace-nowrap text-xs text-slate">
                    {formatDateTime(a.date)}
                  </span>
                </li>
              ))
            ) : (
              <li className="text-sm text-slate">Aucune activité enregistrée.</li>
            )}
          </ul>
        </section>

        <footer className="mt-10 border-t border-line pt-4 text-center text-[11px] text-slate">
          Document généré automatiquement par To be.come — usage familial, non contractuel.
        </footer>
      </div>
    </div>
  );
}
