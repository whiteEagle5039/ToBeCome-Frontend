import { api } from "./client"
import type { Child, Comment, NotificationSettings, ParentProfile } from "@/lib/parent/types"
import type { AppNotification } from "@/lib/parent/types"
import type { AddChildInput } from "@/lib/parent/store"
import {
  mapCommentaire,
  mapEleveToChild,
  mapParentEnfant,
  mapParentProfile,
  defaultNotificationSettings,
  type BackendParentEnfant,
  type BackendParentProfile,
} from "./mappers"

let cachedEmail = ""

export function setParentEmail(email: string) {
  cachedEmail = email
}

function mapParentNotification(n: {
  id: string
  titre: string
  message: string
  isRead: boolean
  createdAt: string
}): AppNotification {
  return {
    id: n.id,
    childId: "",
    date: n.createdAt,
    title: n.titre,
    message: n.message,
    read: n.isRead,
  }
}

export async function fetchParentProfile(): Promise<ParentProfile> {
  const { data } = await api.get<BackendParentProfile>("/api/parent/profile")
  return mapParentProfile(data, cachedEmail)
}

export async function updateParentProfile(profile: ParentProfile): Promise<ParentProfile> {
  cachedEmail = profile.email
  const { data } = await api.put<BackendParentProfile>("/api/parent/profile", {
    prenom: profile.firstName,
    nom: profile.lastName,
    telephone: profile.phone,
  })
  return mapParentProfile(data, profile.email)
}

export async function changeParentPassword(currentPassword: string, newPassword: string) {
  await api.put("/api/parent/password", { currentPassword, newPassword })
}

export async function fetchChildren(): Promise<Child[]> {
  const { data } = await api.get<BackendParentEnfant[]>("/api/parent/enfants")
  return data.map(mapParentEnfant)
}

export async function addChildApi(input: AddChildInput): Promise<Child> {
  const verify = await api.post<{
    valid: boolean
    eleveId?: string
    error?: string
  }>("/api/auth/verify-matricule", {
    matricule: input.matricule.trim().toUpperCase(),
    dateNaissance: input.birthDate,
    mode: "link",
  })

  if (!verify.data.valid || !verify.data.eleveId) {
    throw new Error(verify.data.error ?? "Matricule introuvable")
  }

  const { data } = await api.post<BackendParentEnfant>("/api/parent/enfants/link-matricule", {
    matricule: input.matricule.trim().toUpperCase(),
    prenom: input.firstName,
    nom: input.lastName,
    dateNaissance: input.birthDate,
    lienParente: "Parent",
  })

  return mapParentEnfant(data)
}

export async function fetchChild(id: string): Promise<Child> {
  const { data } = await api.get<{
    eleve: Parameters<typeof mapEleveToChild>[0]
    riasec?: unknown
    badges?: unknown
  }>(`/api/parent/enfants/${id}`)

  const child = mapEleveToChild(data.eleve)

  const commentsRes = await api.get<Array<{ id: string; contenu: string; createdAt: string; parent?: { prenom: string } }>>(
    "/api/parent/commentaire",
    { params: { eleveId: id } },
  )
  child.comments = commentsRes.data.map(mapCommentaire)

  return child
}

export async function addCommentApi(childId: string, text: string): Promise<Comment> {
  const { data } = await api.post<{ id: string; contenu: string; createdAt: string }>(
    "/api/parent/commentaire",
    { eleveId: childId, contenu: text },
  )
  return mapCommentaire({ ...data, parent: { prenom: "Moi" } })
}

export async function fetchNotifications(): Promise<AppNotification[]> {
  const { data } = await api.get<Array<{
    id: string
    titre: string
    message: string
    isRead: boolean
    createdAt: string
  }>>("/api/parent/notifications")
  return data.map(mapParentNotification)
}

export async function markNotificationReadApi(id: string) {
  await api.patch(`/api/parent/notifications/${id}/read`)
}

export async function markAllNotificationsReadApi() {
  await api.patch("/api/parent/notifications/read-all")
}

export async function fetchNotificationSettings(): Promise<NotificationSettings> {
  const { data } = await api.get<NotificationSettings>("/api/parent/notification-settings")
  return data ?? defaultNotificationSettings()
}

export async function updateNotificationSettingsApi(
  settings: NotificationSettings,
): Promise<NotificationSettings> {
  const { data } = await api.put<NotificationSettings>("/api/parent/notification-settings", settings)
  return data
}

export async function exportChildReportPdf(childId: string) {
  const { data } = await api.get<{ downloadUrl?: string }>(`/api/parent/enfants/${childId}/report`)
  return { url: data.downloadUrl ?? "#" }
}
