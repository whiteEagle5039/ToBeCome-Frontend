"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Heart } from "lucide-react"
import { fetchMetier } from "@/lib/api/metiers"
import { useEleveStore } from "@/lib/eleve/store"
import { getMetierById, metiers, domaines } from "@/lib/metiers-data"

export default function EleveMetierDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { toggleFavorite, progress } = useEleveStore()
  const [metier, setMetier] = useState<ReturnType<typeof getMetierById> | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchMetier(slug)
        setMetier({
          id: data.id,
          domaineId: data.domaineId,
          titre: data.titre,
          description: data.description,
          ceQuIlFait: data.ceQuIlFait,
          tachesQuotidiennes: data.tachesQuotidiennes,
          competences: data.competences,
        })
      } catch {
        setMetier(getMetierById(slug) ?? metiers.find((m) => m.id === slug) ?? null)
      }
    }
    load()
  }, [slug])

  if (!metier) {
    return <p className="text-sm text-black/50">Métier introuvable.</p>
  }

  const domain = domaines.find((d) => d.id === metier.domaineId)
  const favorited = progress?.favoriteCareerIds.includes(metier.id) ?? false

  return (
    <div className="space-y-6">
      <Link href="/eleve/metiers" className="inline-flex items-center gap-1 text-sm text-black/50 hover:text-black">
        <ArrowLeft size={16} /> Retour au feed
      </Link>

      <div className="rounded-2xl border border-[#FFCB05]/30 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-[#0F766E]">{domain?.nom}</p>
            <h1 className="mt-1 text-2xl font-bold text-black">{metier.titre}</h1>
          </div>
          <button
            type="button"
            onClick={() => toggleFavorite(metier.id)}
            className="rounded-full border border-[#FFCB05]/40 p-2"
          >
            <Heart size={20} className={favorited ? "fill-[#FFCB05] text-[#FFCB05]" : "text-black/40"} />
          </button>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-black/70">{metier.ceQuIlFait}</p>

        <h2 className="mt-6 font-semibold text-[#0F766E]">Au quotidien</h2>
        <ul className="mt-2 space-y-1">
          {metier.tachesQuotidiennes.map((t) => (
            <li key={t} className="text-sm text-black/70">• {t}</li>
          ))}
        </ul>

        <h2 className="mt-6 font-semibold text-[#0F766E]">Compétences clés</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {metier.competences.map((c) => (
            <span key={c} className="rounded-full bg-[#DFF6F3] px-3 py-1 text-xs font-medium text-[#0F766E]">
              {c}
            </span>
          ))}
        </div>

        <Link
          href={`/eleve/missions?metier=${metier.id}`}
          className="mt-6 inline-flex rounded-full bg-[#FFCB05] px-5 py-2.5 text-sm font-semibold text-black"
        >
          Lancer une mission sur ce métier
        </Link>
      </div>
    </div>
  )
}
