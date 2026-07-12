"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useEleveStore } from "@/lib/eleve/store"
import { LIKERT_OPTIONS, RIASEC_QUESTIONS } from "@/lib/eleve/riasec-questions"

export default function RiasecPage() {
  const router = useRouter()
  const { profile, riasec, submitRiasec } = useEleveStore()
  const isLudique = profile?.niveau === "collegien"

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string>()

  if (riasec) {
    return (
      <div className="mx-auto max-w-lg space-y-6 text-center">
        <CheckCircle2 className="mx-auto size-16 text-[#0F766E]" />
        <h1 className="text-2xl font-bold text-[#0F766E]">Profil RIASEC complété !</h1>
        <p className="text-sm text-black/70">
          Ton profil dominant :{" "}
          <strong>{riasec.dominant.join(" · ")}</strong>
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {riasec.scores.map((s) => (
            <span key={s.type} className="rounded-full bg-[#FFCB05]/30 px-3 py-1 text-sm font-medium">
              {s.label} — {s.score}%
            </span>
          ))}
        </div>
        <Link
          href="/eleve/missions"
          className="inline-flex items-center gap-2 rounded-full bg-[#0F766E] px-6 py-2.5 font-semibold text-white"
        >
          Voir mes missions <ArrowRight size={16} />
        </Link>
      </div>
    )
  }

  const question = RIASEC_QUESTIONS[currentIndex]
  const progress = Math.round(((currentIndex + 1) / RIASEC_QUESTIONS.length) * 100)
  const isLast = currentIndex === RIASEC_QUESTIONS.length - 1

  async function handleNext() {
    if (!answers[question.id]) {
      setError("Choisis une réponse avant de continuer.")
      return
    }
    setError(undefined)
    if (!isLast) {
      setCurrentIndex((i) => i + 1)
      return
    }
    setSubmitting(true)
    const result = await submitRiasec(answers)
    setSubmitting(false)
    if (!result.ok) {
      setError(result.error ?? "Erreur lors de la soumission.")
      return
    }
    router.refresh()
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Link href="/eleve/dashboard" className="inline-flex items-center gap-1 text-sm text-black/50 hover:text-black">
        <ArrowLeft size={16} /> Retour
      </Link>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-[#0F766E]">
          Test RIASEC · {currentIndex + 1}/{RIASEC_QUESTIONS.length}
        </p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/10">
          <div className="h-full bg-[#FFCB05] transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="rounded-2xl border border-[#FFCB05]/40 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-black">
          {isLudique ? "🤔 " : ""}{question.text}
        </h2>
        <div className="mt-6 space-y-2">
          {LIKERT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setAnswers((a) => ({ ...a, [question.id]: opt.value }))}
              className={`w-full rounded-xl border-2 px-4 py-3 text-left text-sm transition-all ${
                answers[question.id] === opt.value
                  ? "border-[#0F766E] bg-[#DFF6F3] font-medium"
                  : "border-transparent hover:border-[#FFCB05]/50 hover:bg-[#FFCB05]/5"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button
          type="button"
          onClick={handleNext}
          disabled={submitting}
          className="mt-6 w-full rounded-full bg-[#FFCB05] py-2.5 font-semibold text-black disabled:opacity-60"
        >
          {submitting ? "Envoi…" : isLast ? "Voir mon profil" : "Question suivante"}
        </button>
      </div>
    </div>
  )
}
