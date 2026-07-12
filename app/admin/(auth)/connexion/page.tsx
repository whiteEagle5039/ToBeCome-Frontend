"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { Shield } from "lucide-react"
import { loginAdmin } from "@/lib/api/admin"
import { getApiErrorMessage } from "@/lib/api/client"

export default function AdminConnexionPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(undefined)
    try {
      await loginAdmin(email.trim(), password)
      router.replace("/admin/dashboard")
    } catch (err) {
      setError(getApiErrorMessage(err, "Identifiants incorrects."))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#FFCB05]/20 text-[#FFCB05] mx-auto">
            <Shield className="h-7 w-7" />
          </span>
          <h1 className="text-2xl font-bold text-white">Administration</h1>
          <p className="text-sm text-slate-400">Gestion de la plateforme To Be.Come</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@tobecome.africa"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-[#0F766E] focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300">Mot de passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-[#0F766E] focus:outline-none"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#0F766E] py-2.5 font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>
      </div>
    </main>
  )
}
