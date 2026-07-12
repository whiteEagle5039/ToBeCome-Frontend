"use client"

import { FormEvent, useState } from "react"
import { changeElevePassword } from "@/lib/api/eleve"
import { getApiErrorMessage } from "@/lib/api/client"
import { useEleveStore } from "@/lib/eleve/store"
import { getIcon } from "@/lib/parent/icons"

const AVATARS = ["rocket", "star", "compass", "trophy", "sparkles", "heart"]

export default function EleveParametresPage() {
  const { profile, refresh } = useEleveStore()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [message, setMessage] = useState<string>()
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)

  async function handlePassword(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(undefined)
    setMessage(undefined)
    try {
      await changeElevePassword(currentPassword, newPassword)
      setMessage("Mot de passe mis à jour.")
      setCurrentPassword("")
      setNewPassword("")
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const AvatarIcon = profile ? getIcon(profile.avatarIcon) : null

  return (
    <div className="mx-auto max-w-md space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-[#0F766E]">Paramètres</h1>
      </header>

      <div className="rounded-2xl border border-[#FFCB05]/30 bg-white p-6">
        <div className="flex items-center gap-4">
          {AvatarIcon && (
            <span className="flex size-14 items-center justify-center rounded-full bg-[#DFF6F3] text-[#0F766E]">
              <AvatarIcon size={28} />
            </span>
          )}
          <div>
            <p className="font-semibold text-black">
              {profile?.firstName} {profile?.lastName}
            </p>
            <p className="text-sm text-black/60">{profile?.matricule}</p>
            <p className="text-xs text-black/40">{profile?.className} · {profile?.school}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handlePassword} className="space-y-4 rounded-2xl border border-[#FFCB05]/30 bg-white p-6">
        <h2 className="font-semibold text-black">Modifier le mot de passe</h2>
        <input
          type="password"
          placeholder="Mot de passe actuel"
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full rounded-lg border px-3 py-2 text-sm focus:border-[#0F766E] focus:outline-none"
        />
        <input
          type="password"
          placeholder="Nouveau mot de passe (6 car. min.)"
          required
          minLength={6}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full rounded-lg border px-3 py-2 text-sm focus:border-[#0F766E] focus:outline-none"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-[#0F766E]">{message}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#0F766E] py-2.5 text-sm font-semibold text-white"
        >
          {loading ? "Enregistrement…" : "Enregistrer"}
        </button>
      </form>
    </div>
  )
}
