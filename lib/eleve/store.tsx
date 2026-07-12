"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { getToken } from "@/lib/api/client"
import { logoutEleve } from "@/lib/api/auth"
import * as eleveApi from "@/lib/api/eleve"
import { getApiErrorMessage, isNetworkError } from "@/lib/api/client"
import type {
  EleveMission,
  EleveNotification,
  EleveProfile,
  EleveProgress,
  RiasecResult,
} from "./types"

interface EleveStoreValue {
  hydrated: boolean
  isAuthenticated: boolean
  profile: EleveProfile | null
  progress: EleveProgress | null
  missions: EleveMission[]
  riasec: RiasecResult | null
  notifications: EleveNotification[]
  loading: boolean
  apiOnline: boolean
  refresh: () => Promise<void>
  logout: () => void
  submitRiasec: (answers: Record<number, number>) => Promise<{ ok: boolean; error?: string }>
  submitMission: (missionId: string, answers: Record<string, unknown>) => Promise<{ ok: boolean; error?: string }>
  toggleFavorite: (careerId: string) => Promise<void>
  markNotificationRead: (id: string) => Promise<void>
}

const EleveStoreContext = createContext<EleveStoreValue | null>(null)

export function EleveStoreProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [profile, setProfile] = useState<EleveProfile | null>(null)
  const [progress, setProgress] = useState<EleveProgress | null>(null)
  const [missions, setMissions] = useState<EleveMission[]>([])
  const [riasec, setRiasec] = useState<RiasecResult | null>(null)
  const [notifications, setNotifications] = useState<EleveNotification[]>([])
  const [loading, setLoading] = useState(false)
  const [apiOnline, setApiOnline] = useState(true)

  const loadData = useCallback(async () => {
    const token = getToken("eleve")
    if (!token) {
      setIsAuthenticated(false)
      return
    }

    setLoading(true)
    try {
      const [prof, prog, miss, rias, notifs] = await Promise.all([
        eleveApi.fetchEleveProfile(),
        eleveApi.fetchEleveProgress(),
        eleveApi.fetchEleveMissions(),
        eleveApi.fetchRiasecResult(),
        eleveApi.fetchEleveNotifications(),
      ])
      setProfile(prof)
      setProgress(prog)
      setMissions(miss)
      setRiasec(rias)
      setNotifications(notifs)
      setIsAuthenticated(true)
      setApiOnline(true)
    } catch (err) {
      if (isNetworkError(err)) setApiOnline(false)
      else if ((err as { response?: { status?: number } }).response?.status === 401) {
        logoutEleve()
        setIsAuthenticated(false)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const token = getToken("eleve")
    setIsAuthenticated(!!token)
    if (token) loadData()
    setHydrated(true)
  }, [loadData])

  const logout = useCallback(() => {
    logoutEleve()
    setIsAuthenticated(false)
    setProfile(null)
    setProgress(null)
    setMissions([])
    setRiasec(null)
    setNotifications([])
  }, [])

  const submitRiasec = useCallback(async (answers: Record<number, number>) => {
    try {
      const result = await eleveApi.submitRiasec(answers)
      setRiasec(result)
      await loadData()
      return { ok: true }
    } catch (err) {
      return { ok: false, error: getApiErrorMessage(err) }
    }
  }, [loadData])

  const submitMission = useCallback(async (missionId: string, answers: Record<string, unknown>) => {
    try {
      await eleveApi.submitMission(missionId, answers)
      await loadData()
      return { ok: true }
    } catch (err) {
      return { ok: false, error: getApiErrorMessage(err) }
    }
  }, [loadData])

  const toggleFavorite = useCallback(async (careerId: string) => {
    try {
      const isFav = progress?.favoriteCareerIds.includes(careerId) ?? false
      await eleveApi.toggleFavorite(careerId, isFav)
      await loadData()
    } catch {
      // silent
    }
  }, [loadData, progress?.favoriteCareerIds])

  const markNotificationRead = useCallback(async (id: string) => {
    try {
      await eleveApi.markEleveNotificationRead(id)
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    } catch {
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    }
  }, [])

  const value = useMemo<EleveStoreValue>(
    () => ({
      hydrated,
      isAuthenticated,
      profile,
      progress,
      missions,
      riasec,
      notifications,
      loading,
      apiOnline,
      refresh: loadData,
      logout,
      submitRiasec,
      submitMission,
      toggleFavorite,
      markNotificationRead,
    }),
    [
      hydrated,
      isAuthenticated,
      profile,
      progress,
      missions,
      riasec,
      notifications,
      loading,
      apiOnline,
      loadData,
      logout,
      submitRiasec,
      submitMission,
      toggleFavorite,
      markNotificationRead,
    ],
  )

  return <EleveStoreContext.Provider value={value}>{children}</EleveStoreContext.Provider>
}

export function useEleveStore() {
  const ctx = useContext(EleveStoreContext)
  if (!ctx) throw new Error("useEleveStore must be used within EleveStoreProvider")
  return ctx
}
