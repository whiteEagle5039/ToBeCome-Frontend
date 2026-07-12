"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { Building2 } from "lucide-react"
import Link from "next/link"
import { loginEtablissement } from "@/lib/api/auth"
import { getApiErrorMessage } from "@/lib/api/client"

export default function ConnexionEtablissementPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(undefined)
    try {
      await loginEtablissement(email, password)
      router.push("/etablissement/dashboard")
    } catch (err) {
      setError(getApiErrorMessage(err, "Identifiants incorrects."))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 bg-white">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div className="text-center space-y-2">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#0F766E]/10 text-[#0F766E] mx-auto">
            <Building2 className="h-7 w-7" strokeWidth={1.75} />
          </span>
          <h1 className="text-xl font-bold text-neutral-900">Connexion établissement</h1>
          <p className="text-sm text-neutral-500">
            Utilisez les identifiants reçus par email après validation.
          </p>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-neutral-700">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#0F766E] focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-neutral-700">Mot de passe</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#0F766E] focus:outline-none"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#FFCB05] font-semibold text-black py-2.5 disabled:opacity-60"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>

        <p className="text-center text-sm text-neutral-500">
          Pas encore inscrit ?{" "}
          <Link href="/etablissement/inscription" className="font-semibold text-[#0F766E] hover:underline">
            Demander un accès
          </Link>
        </p>
      </form>
    </main>
  )
}
