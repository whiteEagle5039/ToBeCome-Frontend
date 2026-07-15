"use client";

import { useEffect, useMemo, useState } from "react";
import { Mail, Search, ShieldAlert, Users, XCircle } from "lucide-react";
import { TopBar } from "@/components/etablissement/TopBar";
import { Badge } from "@/components/etablissement/Badge";
import { Skeleton } from "@/components/etablissement/Skeleton";
import { getApiErrorMessage } from "@/lib/api/client"
import {
  fetchParentsDirectory,
  sendAccesParents,
  type ParentDirectoryItem,
  type SendAccessResponse,
} from "@/lib/api/etablissement"

function formatChildren(parent: ParentDirectoryItem): string {
  if (parent.enfants.length === 0) return "Aucun enfant lié"
  if (parent.enfants.length === 1) {
    const enfant = parent.enfants[0]
    return `${enfant.prenom} ${enfant.nom} · ${enfant.classeNom || "Sans classe"}`
  }
  return `${parent.enfants.length} enfants liés`
}

export default function CommunicationPage() {
  const [parents, setParents] = useState<ParentDirectoryItem[] | null>(null)
  const [search, setSearch] = useState("")
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null)
  const [resultat, setResultat] = useState<SendAccessResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingParents, setLoadingParents] = useState(true)
  const [messageErreur, setMessageErreur] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setLoadingParents(true)
    fetchParentsDirectory()
      .then((data) => {
        if (!active) return
        setParents(data)
      })
      .catch((error) => {
        if (!active) return
        setParents([])
        setMessageErreur(getApiErrorMessage(error, "Impossible de charger les parents."))
      })
      .finally(() => {
        if (active) setLoadingParents(false)
      })

    return () => {
      active = false
    }
  }, [])

  const parentsFiltres = useMemo(() => {
    if (!parents) return []
    const q = search.trim().toLowerCase()
    if (!q) return parents
    return parents.filter((parent) => {
      const haystack = [
        parent.prenom,
        parent.nom,
        parent.email,
        parent.telephone,
        ...parent.enfants.flatMap((enfant) => [
          enfant.prenom,
          enfant.nom,
          enfant.classeNom,
          enfant.etablissementNom,
        ]),
      ]
        .join(" ")
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [parents, search])

  const selectedParent = useMemo(
    () => parents?.find((parent) => parent.id === selectedParentId) ?? null,
    [parents, selectedParentId],
  )

  async function envoyerAcces() {
    setLoading(true)
    setMessageErreur(null)
    try {
      const data = await sendAccesParents({ parentId: selectedParentId ?? undefined })
      setResultat(data)
    } catch (error) {
      setMessageErreur(getApiErrorMessage(error, "Envoi des accès impossible."))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <TopBar title="Communication" subtitle="Sélection des parents et envoi des accès par e-mail" />

      <div className="px-6 py-6 md:px-8">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">Envoyer un lien d'accès</h2>
              <p className="mt-1 text-sm text-slate-500">
                Sélectionne un parent dans le tableau ou laisse la sélection globale pour envoyer à tous les parents.
              </p>
            </div>
            <div className="rounded-full bg-[#0F766E]/10 px-3 py-1.5 text-xs font-medium text-[#0F766E]">
              Lien unique, mot de passe non envoyé en clair
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un parent, un enfant, une classe..."
                className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-[#0F766E]"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={envoyerAcces}
                disabled={loading || loadingParents}
                className="flex items-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2 text-sm font-medium text-white hover:bg-[#0c5f59] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Mail className="h-4 w-4" />
                {loading
                  ? "Envoi en cours…"
                  : selectedParent
                    ? `Envoyer à ${selectedParent.prenom} ${selectedParent.nom}`
                    : "Envoyer à tous les parents"}
              </button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="rounded-full bg-slate-50 px-2.5 py-1">Clique sur une ligne pour sélectionner un parent</span>
            <span className="rounded-full bg-slate-50 px-2.5 py-1">Le tableau est filtrable par recherche</span>
          </div>

          {messageErreur ? (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{messageErreur}</span>
            </div>
          ) : null}

          {resultat ? (
            <div className="mt-5 space-y-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge
                  label={`${resultat.sent}/${resultat.total} envoyés`}
                  tone={resultat.sent === resultat.total ? "success" : resultat.sent > 0 ? "warning" : "danger"}
                />
                <p className="text-sm text-slate-600">
                  {resultat.total === 1
                    ? "Envoi ciblé terminé."
                    : "Envoi groupé terminé. Les erreurs éventuelles apparaissent ci-dessous."}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-white p-3 shadow-sm">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Total ciblé</p>
                  <p className="mt-1 text-xl font-semibold text-slate-800">{resultat.total}</p>
                </div>
                <div className="rounded-xl bg-white p-3 shadow-sm">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Envoyés</p>
                  <p className="mt-1 text-xl font-semibold text-emerald-600">{resultat.sent}</p>
                </div>
                <div className="rounded-xl bg-white p-3 shadow-sm">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Échecs</p>
                  <p className="mt-1 text-xl font-semibold text-rose-600">{resultat.total - resultat.sent}</p>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                    <tr>
                      <th className="px-3 py-2">Parent</th>
                      <th className="px-3 py-2">Email</th>
                      <th className="px-3 py-2">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultat.results.map((row) => (
                      <tr key={row.parentId} className="border-b border-slate-50 last:border-0">
                        <td className="px-3 py-2 font-medium text-slate-700">{row.parentId}</td>
                        <td className="px-3 py-2 text-slate-500">{row.email || "Email manquant"}</td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <Badge
                              label={row.success ? "Envoyé" : "Échec"}
                              tone={row.success ? "success" : "danger"}
                            />
                            {!row.success && row.error ? (
                              <span className="text-xs text-rose-600">{row.error}</span>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <Users className="h-4 w-4 text-[#0F766E]" />
              Liste des parents
            </h2>
            <div className="flex items-center gap-2">
              <Badge
                label={
                  selectedParent
                    ? `Sélectionné: ${selectedParent.prenom} ${selectedParent.nom}`
                    : "Aucun parent sélectionné"
                }
                tone={selectedParent ? "success" : "neutral"}
              />
              {selectedParent ? (
                <button
                  type="button"
                  onClick={() => setSelectedParentId(null)}
                  className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Envoyer à tous
                </button>
              ) : null}
            </div>
          </div>

          {loadingParents ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : parentsFiltres.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
              <p className="text-sm font-medium text-slate-700">Aucun parent trouvé</p>
              <p className="mt-1 text-sm text-slate-500">Essaie avec un autre mot-clé de recherche.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-100">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="px-4 py-3">Parent</th>
                    <th className="px-4 py-3">Contact</th>
                    <th className="px-4 py-3">Enfants</th>
                    <th className="px-4 py-3">Sélection</th>
                  </tr>
                </thead>
                <tbody>
                  {parentsFiltres.map((parent) => {
                    const isSelected = parent.id === selectedParentId
                    return (
                      <tr
                        key={parent.id}
                        onClick={() => setSelectedParentId(parent.id)}
                        className={`cursor-pointer border-b border-slate-50 transition last:border-0 hover:bg-slate-50 ${
                          isSelected ? "bg-[#0F766E]/5" : ""
                        }`}
                      >
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-800">
                            {parent.prenom} {parent.nom}
                          </div>
                          <div className="text-xs text-slate-400">{parent.id}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-500">
                          <div>{parent.email || "Email manquant"}</div>
                          <div>{parent.telephone || "Téléphone manquant"}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            <p className="text-slate-600">{formatChildren(parent)}</p>
                            {parent.enfants.slice(0, 2).map((enfant) => (
                              <p key={enfant.id} className="text-xs text-slate-400">
                                {enfant.prenom} {enfant.nom}
                                {enfant.classeNom ? ` · ${enfant.classeNom}` : ""}
                                {enfant.etablissementNom ? ` · ${enfant.etablissementNom}` : ""}
                              </p>
                            ))}
                            {parent.enfants.length > 2 ? (
                              <p className="text-xs text-slate-400">+ {parent.enfants.length - 2} autre(s) enfant(s)</p>
                            ) : null}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {isSelected ? (
                            <Badge label="Sélectionné" tone="success" />
                          ) : (
                            <Badge label="Cliquer pour sélectionner" tone="neutral" />
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
            <ShieldAlert className="h-4 w-4 text-[#0F766E]" />
            Bon à savoir
          </h2>
          <div className="grid gap-3 text-sm text-slate-600 md:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4">
              Le tableau te permet de sélectionner un parent sans connaître son identifiant.
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              Le lien reçu permet au parent de définir son mot de passe en toute sécurité.
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              Tu peux aussi laisser la sélection globale pour envoyer les accès à tous les parents.
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
