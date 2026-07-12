import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios"

export type UserRole = "parent" | "eleve" | "etablissement" | "admin"
export type BackendEleveRole = "ELEVE_COLLEGE" | "ELEVE_LYCEE"

const TOKEN_KEYS: Record<UserRole, string> = {
  parent: "tobecome_token_parent",
  eleve: "tobecome_token_eleve",
  etablissement: "tobecome_token_etablissement",
  admin: "tobecome_token_admin",
}

const ELEVE_ROLE_KEY = "tobecome_eleve_role"

export function getToken(role: UserRole): string | null {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(TOKEN_KEYS[role])
}

export function setToken(role: UserRole, token: string): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(TOKEN_KEYS[role], token)
}

export function clearToken(role: UserRole): void {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(TOKEN_KEYS[role])
}

export function getEleveRole(): BackendEleveRole {
  if (typeof window === "undefined") return "ELEVE_COLLEGE"
  return (window.localStorage.getItem(ELEVE_ROLE_KEY) as BackendEleveRole) || "ELEVE_COLLEGE"
}

export function setEleveRole(role: BackendEleveRole): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(ELEVE_ROLE_KEY, role)
}

export function clearAllTokens(): void {
  ;(["parent", "eleve", "etablissement", "admin"] as UserRole[]).forEach(clearToken)
}

function roleForPath(url: string): UserRole | null {
  if (url.includes("/api/parent")) return "parent"
  if (url.includes("/api/eleve")) return "eleve"
  if (url.includes("/api/etablissement")) return "etablissement"
  if (url.includes("/api/admin")) return "admin"
  return null
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
  timeout: 20000,
  headers: { "Content-Type": "application/json" },
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window === "undefined") return config
  const url = config.url ?? ""
  const role = roleForPath(url)
  if (role) {
    const token = getToken(role)
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export function getApiErrorMessage(error: unknown, fallback = "Une erreur est survenue."): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string; error?: string } | undefined
    return data?.error ?? data?.message ?? error.message ?? fallback
  }
  return fallback
}

export function isNetworkError(error: unknown): boolean {
  return axios.isAxiosError(error) && !error.response
}

export type ApiError = AxiosError<{ message?: string; error?: string }>
