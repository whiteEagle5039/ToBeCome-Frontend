"use client"

import Link from "next/link"
import { Compass, Heart, Trophy } from "lucide-react"
import { useEleveStore } from "@/lib/eleve/store"
import { metiers, domaines } from "@/lib/metiers-data"

export default function ProgressionPage() {
  const { progress, profile } = useEleveStore()
  const isLudique = profile?.niveau === "collegien"

  const explored = (progress?.exploredCareerIds ?? []).map(
    (id) => metiers.find((m) => m.id === id)?.titre ?? id,
  )
  const mastered = (progress?.masteredCareerIds ?? []).map(
    (id) => metiers.find((m) => m.id === id)?.titre ?? id,
  )
  const favorites = (progress?.favoriteCareerIds ?? []).map((id) => {
    const m = metiers.find((met) => met.id === id)
    return m ? { id, title: m.titre, domain: domaines.find((d) => d.id === m.domaineId)?.nom } : null
  }).filter(Boolean)

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-[#0F766E]">
          {isLudique ? "Ta progression 🚀" : "Suivi personnel"}
        </h1>
        <div className="mt-4 rounded-2xl border border-[#FFCB05]/40 bg-white p-5">
          <p className="text-sm text-black/60">Progression globale</p>
          <p className="text-3xl font-bold text-[#0F766E]">{progress?.progressPercent ?? 0}%</p>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-black/10">
            <div
              className="h-full bg-[#FFCB05] transition-all"
              style={{ width: `${progress?.progressPercent ?? 0}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-black/50">
            {progress?.missionsCompleted ?? 0}/{progress?.missionsTotal ?? 0} missions complétées
          </p>
        </div>
      </header>

      <Section icon={Trophy} title="Badges obtenus">
        {(progress?.badges.length ?? 0) === 0 ? (
          <p className="text-sm text-black/50">Aucun badge pour l&apos;instant — lance une mission !</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {progress!.badges.map((b) => (
              <div key={b.id} className="rounded-xl border border-[#FFCB05]/30 bg-white p-4">
                <p className="font-semibold text-black">🏆 {b.name}</p>
                <p className="text-xs text-black/60">{b.description}</p>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section icon={Compass} title="Métiers explorés">
        {explored.length === 0 ? (
          <p className="text-sm text-black/50">Explore des métiers dans le feed vidéo.</p>
        ) : (
          <ul className="space-y-1">{explored.map((t) => <li key={t} className="text-sm">• {t}</li>)}</ul>
        )}
      </Section>

      <Section icon={Trophy} title="Métiers maîtrisés">
        {mastered.length === 0 ? (
          <p className="text-sm text-black/50">Complète des missions pour maîtriser un métier.</p>
        ) : (
          <ul className="space-y-1">{mastered.map((t) => <li key={t} className="text-sm">• {t}</li>)}</ul>
        )}
      </Section>

      <Section icon={Heart} title="Favoris">
        {favorites.length === 0 ? (
          <p className="text-sm text-black/50">Ajoute des métiers à tes favoris depuis le feed.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {favorites.map((f) => (
              <Link
                key={f!.id}
                href={`/eleve/metiers/${f!.id}`}
                className="rounded-full bg-[#DFF6F3] px-3 py-1 text-xs font-medium text-[#0F766E]"
              >
                {f!.title}
              </Link>
            ))}
          </div>
        )}
      </Section>
    </div>
  )
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  children: React.ReactNode
}) {
  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2 font-semibold text-black">
        <Icon className="size-5 text-[#0F766E]" /> {title}
      </h2>
      {children}
    </section>
  )
}
