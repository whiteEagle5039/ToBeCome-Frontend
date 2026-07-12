"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { registerEleve, verifyMatricule } from "@/lib/api/auth"
import { getApiErrorMessage } from "@/lib/api/client"
import { useEleveStore } from "@/lib/eleve/store"
import type { EleveNiveau } from "@/lib/eleve/types"

const AVATARS = [
  { id: "rocket", label: "🚀" },
  { id: "star", label: "⭐" },
  { id: "compass", label: "🧭" },
  { id: "trophy", label: "🏆" },
  { id: "sparkles", label: "✨" },
  { id: "heart", label: "💛" },
]

export function EleveInscriptionForm({ niveau }: { niveau: EleveNiveau }) {
  const router = useRouter()
  const { refresh } = useEleveStore()
  const isLudique = niveau === "collegien"

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [matricule, setMatricule] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [className, setClassName] = useState("")
  const [school, setSchool] = useState("")
  const [password, setPassword] = useState("")
  const [avatarIcon, setAvatarIcon] = useState("rocket")
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)

  async function verifyStep1(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(undefined)
    try {
      const result = await verifyMatricule(matricule.trim().toUpperCase(), birthDate, "register")
      if (!result.valid) {
        setError(result.error ?? "Matricule invalide.")
        return
      }
      if (result.school) setSchool(result.school)
      setStep(2)
    } catch (err) {
      setError(getApiErrorMessage(err, "Impossible de vérifier le matricule."))
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(e: FormEvent) {
    e.preventDefault()
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.")
      return
    }
    setLoading(true)
    setError(undefined)
    try {
      await registerEleve({
        matricule: matricule.trim().toUpperCase(),
        birthDate,
        password,
        firstName,
        lastName,
        avatarIcon,
        niveau,
      })
      await refresh()
      router.replace("/eleve/riasec")
    } catch (err) {
      setError(getApiErrorMessage(err, "Inscription impossible."))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <Link
        href="/onboarding/choix-niveau"
        className="absolute left-6 top-6 inline-flex items-center gap-2 text-sm text-black/50 hover:text-black"
      >
        <ArrowLeft className="h-4 w-4" /> Retour
      </Link>

      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#0F766E]">
            {isLudique ? "Salut l'explorateur ! 🌟" : "Inscription Élève"}
          </p>
          <h1 className="text-2xl font-bold text-black">
            {step === 1 && "Vérifie ton matricule"}
            {step === 2 && "Ton identité"}
            {step === 3 && "Crée ton mot de passe"}
          </h1>
          <p className="text-sm text-black/60">
            {step === 1 && "Utilise le matricule fourni par ton établissement."}
            {step === 2 && "Confirme ton identité et choisis ton avatar."}
            {step === 3 && "Dernière étape avant l'aventure !"}
          </p>
        </div>

        {step === 1 && (
          <form onSubmit={verifyStep1} className="space-y-4 rounded-2xl border border-[#FFCB05]/40 bg-white p-6 shadow-sm">
            <div className="space-y-1">
              <label className="text-sm font-medium">Matricule</label>
              <input
                required
                value={matricule}
                onChange={(e) => setMatricule(e.target.value)}
                placeholder="COT-2026-0145"
                className="w-full rounded-lg border px-3 py-2 text-sm uppercase focus:border-[#0F766E] focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Date de naissance</label>
              <input
                type="date"
                required
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-[#0F766E] focus:outline-none"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" disabled={loading} className="w-full rounded-full bg-[#FFCB05] py-2.5 font-semibold text-black">
              {loading ? "Vérification…" : "Continuer"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (!firstName.trim() || !lastName.trim()) {
                setError("Renseigne ton prénom et ton nom.")
                return
              }
              setError(undefined)
              setStep(3)
            }}
            className="space-y-4 rounded-2xl border border-[#FFCB05]/40 bg-white p-6 shadow-sm"
          >
            {school && (
              <p className="text-sm text-black/70">
                Établissement : <strong>{school}</strong>
              </p>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-medium">Prénom</label>
                <input
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:border-[#0F766E] focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Nom</label>
                <input
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:border-[#0F766E] focus:outline-none"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Classe (optionnel)</label>
              <input
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="5ème A"
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-[#0F766E] focus:outline-none"
              />
            </div>
            <p className="text-sm font-medium text-black/80">Choisis ton avatar</p>
            <div className="grid grid-cols-3 gap-3">
              {AVATARS.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setAvatarIcon(a.id)}
                  className={`flex flex-col items-center gap-1 rounded-xl border-2 p-4 transition-all ${
                    avatarIcon === a.id ? "border-[#0F766E] bg-[#DFF6F3]" : "border-transparent hover:border-[#FFCB05]"
                  }`}
                >
                  <span className="text-2xl">{a.label}</span>
                </button>
              ))}
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" className="w-full rounded-full bg-[#FFCB05] py-2.5 font-semibold text-black">
              Continuer
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleRegister} className="space-y-4 rounded-2xl border border-[#FFCB05]/40 bg-white p-6 shadow-sm">
            <div className="space-y-1">
              <label className="text-sm font-medium">Mot de passe</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-[#0F766E] focus:outline-none"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" disabled={loading} className="w-full rounded-full bg-[#0F766E] py-2.5 font-semibold text-white">
              {loading ? "Création…" : isLudique ? "C'est parti ! 🚀" : "Créer mon compte"}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-black/60">
          Déjà un compte ?{" "}
          <Link href="/eleve/connexion" className="font-semibold text-[#0F766E] hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </main>
  )
}
