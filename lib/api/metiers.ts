import axios from "axios"
import { mapMetierPublic, type BackendMetier } from "./mappers"

const publicApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
  timeout: 20000,
})

export async function fetchPublicDomaines() {
  const { data } = await publicApi.get<Array<{ id: string; nom: string; description?: string; metiers?: BackendMetier[] }>>(
    "/api/public/domaines",
  )
  return data
}

export async function fetchPublicMetiers(params?: { domaineId?: string; search?: string }) {
  if (params?.search) {
    const { data } = await publicApi.get<BackendMetier[]>("/api/public/metiers", {
      params: { q: params.search },
    })
    return data.map(mapMetierPublic)
  }
  if (params?.domaineId) {
    const { data } = await publicApi.get<BackendMetier[]>("/api/public/metiers", {
      params: { domaineId: params.domaineId },
    })
    return data.map(mapMetierPublic)
  }
  const domaines = await fetchPublicDomaines()
  return domaines.flatMap((d) => (d.metiers ?? []).map(mapMetierPublic))
}

export async function fetchPublicMetier(idOrSlug: string) {
  const { data } = await publicApi.get<BackendMetier>(`/api/public/metiers/${idOrSlug}`)
  return mapMetierPublic(data)
}

export async function suggestMetierApi(payload: { titre: string; domaine?: string; message?: string }) {
  // Keep using Next.js route until backend implements it
  const res = await fetch("/api/suggest-metier", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  return res.json()
}

// Authenticated eleve metiers (when logged in as student)
export { fetchEleveMetiers as fetchMetiers, fetchEleveMetier as fetchMetier } from "./eleve"
