import { api, getEleveRole } from "./client"
import type {
  EleveMission,
  EleveNotification,
  EleveProfile,
  EleveProgress,
  RiasecResult,
} from "@/lib/eleve/types"
import {
  answersToRiasecPayload,
  mapEleveNotification,
  mapEleveProfile,
  mapEleveProgress,
  mapMetierPublic,
  mapMission,
  mapMissionProgress,
  mapRiasecResult,
  type BackendEleveProfile,
  type BackendMission,
  type BackendMissionProgress,
  type BackendNotification,
  type BackendRiasec,
} from "./mappers"

export async function fetchEleveProfile(): Promise<EleveProfile> {
  const { data } = await api.get<BackendEleveProfile>("/api/eleve/profile")
  return mapEleveProfile(data, getEleveRole())
}

export async function updateEleveProfile(payload: Partial<EleveProfile>) {
  const { data } = await api.put<BackendEleveProfile>("/api/eleve/profile", {
    prenom: payload.firstName,
    nom: payload.lastName,
  })
  return mapEleveProfile(data, getEleveRole())
}

export async function fetchEleveMissions(): Promise<EleveMission[]> {
  const [available, inProgress, completed, riasec] = await Promise.all([
    api.get<BackendMission[]>("/api/eleve/missions"),
    api.get<BackendMissionProgress[]>("/api/eleve/missions", { params: { status: "inProgress" } }),
    api.get<BackendMissionProgress[]>("/api/eleve/missions", { params: { status: "completed" } }),
    fetchRiasecResult(),
  ])

  const riasecDone = !!riasec
  const missions: EleveMission[] = [
    ...available.data.map((m) => mapMission(m, riasecDone)),
    ...inProgress.data.map(mapMissionProgress),
    ...completed.data.map(mapMissionProgress),
  ]

  const seen = new Set<string>()
  return missions.filter((m) => {
    if (seen.has(m.id)) return false
    seen.add(m.id)
    return true
  })
}

export async function startMission(missionId: string) {
  const { data } = await api.post<BackendMissionProgress>(`/api/eleve/missions/${missionId}`)
  return data
}

export async function validateMissionStep(missionId: string, stepId: string, score = 100) {
  const { data } = await api.post(`/api/eleve/missions/${missionId}/step/${stepId}`, { score })
  return data
}

export async function submitMission(missionId: string, _answers: Record<string, unknown>) {
  let progress = await api.get<BackendMissionProgress>(`/api/eleve/missions/${missionId}`).catch(() => null)

  if (!progress?.data) {
    await startMission(missionId)
    progress = await api.get<BackendMissionProgress>(`/api/eleve/missions/${missionId}`)
  }

  const missionData = progress!.data
  const steps = missionData.mission?.etapes ?? []

  for (const step of steps) {
    const stepProgress = missionData.etapes?.find((s) => s.etapeId === step.id)
    if (!stepProgress?.isComplete) {
      await validateMissionStep(missionId, step.id, 100)
    }
  }

  return { success: true }
}

export async function fetchEleveProgress(): Promise<EleveProgress> {
  const [progressRes, profileRes, riasec, missions] = await Promise.all([
    api.get<{
      xpTotal?: number
      badges?: BackendEleveProfile["badges"]
      metiersExplores?: BackendEleveProfile["metiersExplores"]
      metiersModels?: BackendEleveProfile["metiersModels"]
    }>("/api/eleve/progression"),
    api.get<BackendEleveProfile>("/api/eleve/profile"),
    fetchRiasecResult(),
    fetchEleveMissions(),
  ])

  const completed = missions.filter((m) => m.status === "completed").length
  return mapEleveProgress(
    { ...progressRes.data, favoris: profileRes.data.favoris },
    !!riasec,
    missions.length,
    completed,
  )
}

export async function fetchRiasecResult(): Promise<RiasecResult | null> {
  const { data } = await api.get<BackendRiasec | null>("/api/eleve/riasec")
  return data ? mapRiasecResult(data) : null
}

export async function submitRiasec(answers: Record<number, number>): Promise<RiasecResult> {
  const payload = answersToRiasecPayload(answers)
  const { data } = await api.post<BackendRiasec>("/api/eleve/riasec", payload)
  return mapRiasecResult(data)
}

export async function toggleFavorite(careerId: string, remove = false) {
  await api.post("/api/eleve/favoris", { metierId: careerId, remove })
  return { favorited: !remove }
}

export async function fetchEleveMetiers(params?: { q?: string; domaineId?: string }) {
  const { data } = await api.get("/api/eleve/metiers", { params })
  if (Array.isArray(data) && data[0]?.nom && data[0]?.domaineId) {
    return data.map(mapMetierPublic)
  }
  if (Array.isArray(data)) {
    return data.flatMap((d: { metiers?: unknown[] }) =>
      (d.metiers ?? []).map((m) => mapMetierPublic(m as Parameters<typeof mapMetierPublic>[0])),
    )
  }
  return []
}

export async function fetchEleveMetier(idOrSlug: string) {
  const { data } = await api.get(`/api/eleve/metiers/${idOrSlug}`)
  return mapMetierPublic(data)
}

export async function fetchEleveNotifications(): Promise<EleveNotification[]> {
  const { data } = await api.get<BackendNotification[]>("/api/eleve/notifications")
  return data.map(mapEleveNotification)
}

export async function markEleveNotificationRead(id: string) {
  await api.put("/api/eleve/notifications", { notificationId: id })
}

export async function changeElevePassword(currentPassword: string, newPassword: string) {
  await api.put("/api/eleve/password", { currentPassword, newPassword })
}

export interface MissionStepDetail {
  id: string
  titre: string
  type: string
  contenu: unknown
  isComplete: boolean
}

export async function fetchMissionDetail(missionId: string) {
  try {
    const { data } = await api.get<BackendMissionProgress>(`/api/eleve/missions/${missionId}`)
    return data
  } catch {
    await startMission(missionId)
    const { data } = await api.get<BackendMissionProgress>(`/api/eleve/missions/${missionId}`)
    return data
  }
}

export async function fetchMissionSteps(missionId: string): Promise<MissionStepDetail[]> {
  const progress = await fetchMissionDetail(missionId)
  const missionSteps = progress.mission?.etapes ?? []
  const stepProgress = progress.etapes ?? []

  return missionSteps
    .slice()
    .sort((a, b) => ((a as { ordre?: number }).ordre ?? 0) - ((b as { ordre?: number }).ordre ?? 0))
    .map((step) => {
      const prog = stepProgress.find((s) => s.etapeId === step.id)
      const full = prog as { etape?: { contenu?: unknown } } | undefined
      return {
        id: step.id,
        titre: step.titre,
        type: step.type,
        contenu: full?.etape?.contenu ?? (step as { contenu?: unknown }).contenu,
        isComplete: prog?.isComplete ?? false,
      }
    })
}
