"use client"

import Link from "next/link"
import { ArrowRight, Compass, Sparkles, Target, Trophy } from "lucide-react"
import { useEleveStore } from "@/lib/eleve/store"

export default function EleveDashboardPage() {
  const { profile, progress, riasec, missions, apiOnline } = useEleveStore()
  const isLudique = profile?.niveau === "collegien"
  const riasecDone = progress?.riasecCompleted ?? !!riasec
  const pendingMissions = missions.filter((m) => m.status === "available").length

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-[#0F766E] sm:text-3xl">
          {isLudique
            ? `Salut ${profile?.firstName} ! 👋`
            : `Bonjour ${profile?.firstName}`}
        </h1>
        <p className="mt-1 text-sm text-black/60">
          {isLudique
            ? "Prêt(e) à explorer de nouveaux métiers aujourd'hui ?"
            : "Voici où en est ton parcours d'orientation."}
        </p>
        {!apiOnline && (
          <p className="mt-2 rounded-lg bg-amber-100 px-3 py-2 text-xs text-amber-800">
            Mode hors-ligne — certaines données peuvent être indisponibles.
          </p>
        )}
      </header>

      {!riasecDone && (
        <div className="rounded-2xl border-2 border-[#FFCB05] bg-[#FFCB05]/10 p-6">
          <div className="flex items-start gap-4">
            <Sparkles className="mt-1 size-8 shrink-0 text-[#0F766E]" />
            <div>
              <h2 className="font-semibold text-[#0F766E]">Étape 1 — Découvre qui tu es</h2>
              <p className="mt-1 text-sm text-black/70">
                Le test RIASEC est obligatoire pour débloquer les missions métiers.
                {isLudique ? " C'est fun, promis ! 🎯" : " Il te prend environ 10 minutes."}
              </p>
              <Link
                href="/eleve/riasec"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#0F766E] px-5 py-2 text-sm font-semibold text-white"
              >
                Commencer le test <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Trophy}
          label="Progression"
          value={`${progress?.progressPercent ?? 0}%`}
        />
        <StatCard
          icon={Compass}
          label="Métiers explorés"
          value={String(progress?.exploredCareerIds.length ?? 0)}
        />
        <StatCard
          icon={Target}
          label="Missions en attente"
          value={String(pendingMissions)}
        />
        <StatCard
          icon={Sparkles}
          label="Badges"
          value={String(progress?.badges.length ?? 0)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/eleve/metiers"
          className="group rounded-2xl border-2 border-[#0F766E]/20 bg-white p-6 shadow-sm transition-all hover:border-[#FFCB05] hover:shadow-md"
        >
          <Compass className="size-8 text-[#0F766E]" />
          <h3 className="mt-3 font-semibold text-black">Explorer les métiers</h3>
          <p className="mt-1 text-sm text-black/60">
            Feed vidéo, fiches détaillées et favoris.
          </p>
        </Link>
        <Link
          href="/eleve/missions"
          className="group rounded-2xl border-2 border-[#0F766E]/20 bg-white p-6 shadow-sm transition-all hover:border-[#FFCB05] hover:shadow-md"
        >
          <Target className="size-8 text-[#FFCB05]" />
          <h3 className="mt-3 font-semibold text-black">Mes missions</h3>
          <p className="mt-1 text-sm text-black/60">
            Quiz, mises en situation et défis pour maîtriser un métier.
          </p>
        </Link>
      </div>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-[#FFCB05]/30 bg-white p-5 shadow-sm">
      <Icon className="size-5 text-[#0F766E]" />
      <p className="mt-2 text-2xl font-bold text-black">{value}</p>
      <p className="text-xs text-black/50">{label}</p>
    </div>
  )
}
