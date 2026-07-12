"use client"

import { use, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { fetchMissionSteps } from "@/lib/api/eleve"
import { getApiErrorMessage } from "@/lib/api/client"
import { useEleveStore } from "@/lib/eleve/store"

interface MissionQuestion {
  id: string
  text: string
  options: string[]
}

function parseStepToQuestion(
  stepId: string,
  titre: string,
  contenu: unknown,
): MissionQuestion {
  const c = contenu as { question?: string; options?: string[]; texte?: string; consigne?: string } | null
  if (c?.question && Array.isArray(c.options) && c.options.length > 0) {
    return { id: stepId, text: c.question, options: c.options }
  }
  if (c?.consigne) {
    return { id: stepId, text: c.consigne, options: ["Continuer"] }
  }
  if (c?.texte) {
    return { id: stepId, text: c.texte, options: ["Continuer"] }
  }
  return { id: stepId, text: titre, options: ["Continuer"] }
}

export default function MissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { missions, submitMission, profile } = useEleveStore()
  const mission = missions.find((m) => m.id === id)

  const [questions, setQuestions] = useState<MissionQuestion[]>([])
  const [loadingMission, setLoadingMission] = useState(true)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)

  const isLudique = profile?.niveau === "collegien"

  useEffect(() => {
    let active = true
    async function load() {
      setLoadingMission(true)
      try {
        const steps = await fetchMissionSteps(id)
        if (!active) return
        const incomplete = steps.filter((s) => !s.isComplete)
        const source = incomplete.length > 0 ? incomplete : steps
        setQuestions(
          source.map((s) => parseStepToQuestion(s.id, s.titre, s.contenu)),
        )
        setStep(0)
      } catch (err) {
        if (active) setError(getApiErrorMessage(err, "Impossible de charger la mission."))
      } finally {
        if (active) setLoadingMission(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [id])

  const question = useMemo(() => questions[step], [questions, step])

  if (!mission) {
    return (
      <div className="text-center">
        <p className="text-sm text-black/50">Mission introuvable.</p>
        <Link href="/eleve/missions" className="mt-4 text-sm text-[#0F766E] underline">
          Retour aux missions
        </Link>
      </div>
    )
  }

  if (done) {
    return (
      <div className="mx-auto max-w-md space-y-4 text-center">
        <CheckCircle2 className="mx-auto size-16 text-[#0F766E]" />
        <h1 className="text-xl font-bold text-[#0F766E]">
          {isLudique ? "Bravo champion ! 🏆" : "Mission validée"}
        </h1>
        {mission.badgeName && (
          <p className="text-sm text-black/70">Badge débloqué : {mission.badgeName}</p>
        )}
        <Link href="/eleve/progression" className="inline-flex rounded-full bg-[#FFCB05] px-5 py-2 text-sm font-semibold">
          Voir ma progression
        </Link>
      </div>
    )
  }

  if (loadingMission) {
    return <p className="text-sm text-black/50">Chargement de la mission…</p>
  }

  if (!question) {
    return (
      <div className="text-center">
        <p className="text-sm text-black/50">Aucune étape disponible pour cette mission.</p>
        <Link href="/eleve/missions" className="mt-4 text-sm text-[#0F766E] underline">
          Retour aux missions
        </Link>
      </div>
    )
  }

  async function handleAnswer(option: string) {
    const next = { ...answers, [question.id]: option }
    setAnswers(next)
    if (step < questions.length - 1) {
      setStep((s) => s + 1)
      return
    }
    setLoading(true)
    const result = await submitMission(id, next)
    setLoading(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    setDone(true)
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Link href="/eleve/missions" className="inline-flex items-center gap-1 text-sm text-black/50">
        <ArrowLeft size={16} /> Retour
      </Link>
      <div>
        <p className="text-xs uppercase tracking-wide text-[#0F766E]">{mission.title}</p>
        <div className="mt-2 h-2 rounded-full bg-black/10">
          <div
            className="h-full bg-[#FFCB05]"
            style={{ width: `${((step + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>
      <div className="rounded-2xl border border-[#FFCB05]/40 bg-white p-6">
        <h2 className="font-semibold text-black">{question.text}</h2>
        <div className="mt-4 space-y-2">
          {question.options.map((opt) => (
            <button
              key={opt}
              type="button"
              disabled={loading}
              onClick={() => handleAnswer(opt)}
              className="w-full rounded-xl border-2 border-transparent px-4 py-3 text-left text-sm hover:border-[#0F766E] hover:bg-[#DFF6F3]"
            >
              {opt}
            </button>
          ))}
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  )
}
