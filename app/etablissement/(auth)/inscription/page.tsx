"use client"

import { useState } from "react"
import { Building2 } from "lucide-react"

/**
 * Demande d'accès établissement : aucun mot de passe à choisir ici.
 * Une fois la demande approuvée par l'administrateur, l'établissement
 * reçoit automatiquement ses identifiants de connexion par e-mail
 * (modifiables après la première connexion).
 */
export default function DemandeAccesEtablissementPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string>()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("loading")
    setErrorMessage(undefined)

    const formData = new FormData(e.currentTarget)

    try {
      const res = await fetch("/api/etablissement/demande", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomEtablissement: formData.get("nomEtablissement"),
          ville: formData.get("ville"),
          email: formData.get("email"),
          telephone: formData.get("telephone") || undefined,
          message: formData.get("message") || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Une erreur est survenue, réessayez.")
      setStatus("success")
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Une erreur est survenue, réessayez.")
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-white">
        <div className="text-center max-w-md space-y-3">
          <h1 className="text-2xl font-bold text-neutral-900">Demande envoyée</h1>
          <p className="text-neutral-500">
            Merci ! Votre demande est en attente de validation par notre équipe.
            Dès l'approbation, vous recevrez vos identifiants de connexion par
            e-mail — vous pourrez changer votre mot de passe après votre
            première connexion.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 px-6 py-12 bg-white">
      <div className="text-center space-y-2">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#0F766E]/10 text-[#0F766E] mx-auto">
          <Building2 className="h-7 w-7" strokeWidth={1.75} />
        </span>
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">
          Espace Établissement
        </h1>
        <p className="text-neutral-500 text-sm md:text-base max-w-md">
          Créez votre compte. Un administrateur validera votre établissement
          avant que vous puissiez pleinement l'utiliser.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-2xl border border-neutral-200 p-6 shadow-sm"
      >
        <div className="space-y-1">
          <label className="text-sm font-medium text-neutral-700">
            Nom de l'établissement
          </label>
          <input
            name="nomEtablissement"
            required
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#0F766E] focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-neutral-700">Ville</label>
          <input
            name="ville"
            required
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#0F766E] focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-neutral-700">
            Email professionnel
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#0F766E] focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-neutral-700">
            Téléphone (optionnel)
          </label>
          <input
            name="telephone"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#0F766E] focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-neutral-700">
            Message (optionnel)
          </label>
          <textarea
            name="message"
            rows={3}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#0F766E] focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-full bg-[#FFCB05] font-semibold text-black py-2.5 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60"
        >
          {status === "loading" ? "Envoi..." : "Envoyer ma demande"}
        </button>

        {status === "error" && errorMessage && (
          <p className="text-sm text-red-600 text-center">{errorMessage}</p>
        )}
      </form>
    </main>
  )
}