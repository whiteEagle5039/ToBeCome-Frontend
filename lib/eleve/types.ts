import type { RiasecType } from "@/lib/parent/types"

export type EleveNiveau = "collegien" | "lyceen"

export interface RiasecScore {
  type: RiasecType
  label: string
  score: number
}

export interface RiasecResult {
  dominant: RiasecType[]
  scores: RiasecScore[]
  completedAt: string
  suggestedCareerIds: string[]
}

export interface EleveBadge {
  id: string
  name: string
  description: string
  icon: string
  dateEarned: string
  careerId?: string
}

export type MissionType = "riasec" | "quiz" | "mise_en_situation" | "defi"
export type MissionStatus = "locked" | "available" | "in_progress" | "completed"

export interface EleveMission {
  id: string
  type: MissionType
  title: string
  description: string
  careerId?: string
  careerTitle?: string
  status: MissionStatus
  stepsTotal: number
  stepsCompleted: number
  badgeName?: string
}

export interface EleveProgress {
  progressPercent: number
  riasecCompleted: boolean
  exploredCareerIds: string[]
  masteredCareerIds: string[]
  favoriteCareerIds: string[]
  badges: EleveBadge[]
  missionsCompleted: number
  missionsTotal: number
}

export interface EleveProfile {
  id: string
  matricule: string
  firstName: string
  lastName: string
  birthDate: string
  className: string
  school: string
  avatarIcon: string
  niveau: EleveNiveau
  email?: string
}

export interface EleveNotification {
  id: string
  date: string
  title: string
  message: string
  read: boolean
}

export interface CareerFeedItem {
  id: string
  slug: string
  title: string
  domain: string
  summary: string
  videoUrl?: string
  videoLength: string
  riasec: RiasecType[]
  favorited: boolean
}
