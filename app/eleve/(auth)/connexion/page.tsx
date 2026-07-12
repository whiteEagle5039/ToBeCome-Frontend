"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { GraduationCap } from "lucide-react"
import { loginEleve } from "@/lib/api/auth"
import { getApiErrorMessage } from "@/lib/api/client"
import { useEleveStore } from "@/lib/eleve/store"

export default function EleveConnexionPage() {
  const router = useRouter()
  const { refresh } = useEleveStore()
  const [matricule, setMatricule] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(undefined)
    try {
      await loginEleve(matricule.trim().toUpperCase(), password)
      await refresh()
      router.replace("/eleve/dashboard")
    } catch (err) {
      setError(getApiErrorMessage(err, "Identifiants incorrects."))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#FFCB05]/30 text-[#0F766E] mx-auto">
            <GraduationCap className="h-7 w-7" />
          </span>
          <h1 className="text-2xl font-bold text-[#0F766E]">Espace Élève</h1>
          <p className="text-sm text-black/60">
            Connecte-toi avec ton matricule et ton mot de passe.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-[#FFCB05]/40 bg-white p-6 shadow-sm">
          <div className="space-y-1">
            <label className="text-sm font-medium text-black/80">Matricule</label>
            <input
              required
              value={matricule}
              onChange={(e) => setMatricule(e.target.value)}
              placeholder="COT-2026-0145"
              className="w-full rounded-lg border border-black/20 px-3 py-2 text-sm uppercase focus:border-[#0F766E] focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-black/80">Mot de passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-black/20 px-3 py-2 text-sm focus:border-[#0F766E] focus:outline-none"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#FFCB05] py-2.5 font-semibold text-black disabled:opacity-60"
          >
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>

        <p className="text-center text-sm text-black/60">
          Pas encore de compte ?{" "}
          <Link href="/onboarding/choix-niveau" className="font-semibold text-[#0F766E] hover:underline">
            Créer mon compte
          </Link>
        </p>
      </div>
    </main>
  )
}
