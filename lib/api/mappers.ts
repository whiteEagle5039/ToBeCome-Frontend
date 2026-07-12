import type { RiasecType } from "@/lib/parent/types"
import type {
  ActivityItem,
  Badge,
  Child,
  Comment,
  NotificationSettings,
  ParentProfile,
  RiasecScore,
} from "@/lib/parent/types"
import type {
  EleveBadge,
  EleveMission,
  EleveNotification,
  EleveProfile,
  EleveProgress,
  RiasecResult,
} from "@/lib/eleve/types"
import type {
  Abonnement,
  Classe,
  DashboardOverview,
  Eleve,
  Matricule,
  ParametresEtablissement,
  Rapport,
} from "@/types/etablissement"
import { RIASEC_LABELS } from "@/lib/eleve/riasec-questions"

export interface BackendRiasec {
  scoreR: number
  scoreI: number
  scoreA: number
  scoreS: number
  scoreE: number
  scoreC: number
  typesPrincipaux: string[]
  createdAt?: string
}

export interface BackendEleveProfile {
  id: string
  prenom: string
  nom: string
  dateNaissance: string
  avatarUrl?: string | null
  xpTotal?: number
  isLycee?: boolean
  matricule?: { code: string }
  classe?: { id: string; nom: string; niveau?: string }
  etablissement?: { id: string; nom: string }
  riasecResultat?: BackendRiasec | null
  badges?: Array<{ badge: { id: string; nom: string; description: string }; obtenuAt: string }>
  metiersExplores?: Array<{ metierId: string; metier?: { id: string; nom: string } }>
  metiersModels?: Array<{ metierId: string; metier?: { id: string; nom: string } }>
  favoris?: Array<{ metierId: string; metier?: { id: string; nom: string } }>
}

export interface BackendParentEnfant {
  id: string
  eleveId: string
  lienParente: string
  eleve: BackendEleveProfile
}

export interface BackendParentProfile {
  id: string
  prenom: string
  nom: string
  telephone?: string | null
  enfants?: BackendParentEnfant[]
}

export interface BackendMission {
  id: string
  titre: string
  description: string
  metierId?: string
  metier?: { nom: string }
  etapes?: Array<{ id: string; type: string; titre: string; ordre?: number; contenu?: unknown }>
}

export interface BackendMissionProgress {
  id: string
  isComplete: boolean
  mission: BackendMission
  etapes?: Array<{
    isComplete: boolean
    etapeId: string
    etape?: { id: string; type: string; titre: string; ordre?: number; contenu?: unknown }
  }>
}

export interface BackendMetier {
  id: string
  nom: string
  slug: string
  domaineId: string
  description: string
  descriptionCourte: string
  videoUrl?: string | null
  riasecTypes?: string[]
  domaine?: { id: string; nom: string }
}

export interface BackendNotification {
  id: string
  titre: string
  message: string
  isRead: boolean
  createdAt: string
}

// Icône par défaut quand l'élève n'a pas encore de `avatarUrl` renseigné.
const DEFAULT_AVATAR_ICON = "rocket"

// `avatarUrl` sert ici de clé d'icône (ex: "sun", "zap", "palette"), pas
// forcément d'une vraie URL d'image — d'où la lecture directe du champ.
function resolveAvatarIcon(avatarUrl?: string | null): string {
  return avatarUrl && avatarUrl.trim() ? avatarUrl : DEFAULT_AVATAR_ICON
}

export function mapRiasecScores(r: BackendRiasec): RiasecScore[] {
  const types: RiasecType[] = ["R", "I", "A", "S", "E", "C"]
  return types.map((type) => ({
    type,
    label: RIASEC_LABELS[type],
    score: r[`score${type}` as keyof BackendRiasec] as number,
  }))
}

export function mapRiasecResult(r: BackendRiasec): RiasecResult {
  return {
    dominant: r.typesPrincipaux as RiasecType[],
    scores: mapRiasecScores(r),
    completedAt: r.createdAt ?? new Date().toISOString(),
    suggestedCareerIds: [],
  }
}

export function answersToRiasecPayload(answers: Record<number, number>) {
  const totals: Record<RiasecType, { sum: number; count: number }> = {
    R: { sum: 0, count: 0 },
    I: { sum: 0, count: 0 },
    A: { sum: 0, count: 0 },
    S: { sum: 0, count: 0 },
    E: { sum: 0, count: 0 },
    C: { sum: 0, count: 0 },
  }
  const questionTypes: Record<number, RiasecType> = {
    1: "R", 2: "R", 3: "R",
    4: "I", 5: "I", 6: "I",
    7: "A", 8: "A", 9: "A",
    10: "S", 11: "S", 12: "S",
    13: "E", 14: "E", 15: "E",
    16: "C", 17: "C", 18: "C",
  }
  for (const [qId, val] of Object.entries(answers)) {
    const type = questionTypes[Number(qId)]
    if (type && val) {
      totals[type].sum += val
      totals[type].count += 1
    }
  }
  const toScore = (t: RiasecType) =>
    totals[t].count ? Math.round((totals[t].sum / (totals[t].count * 5)) * 100) : 0

  return {
    scoreR: toScore("R"),
    scoreI: toScore("I"),
    scoreA: toScore("A"),
    scoreS: toScore("S"),
    scoreE: toScore("E"),
    scoreC: toScore("C"),
  }
}

export function mapParentProfile(p: BackendParentProfile, email = ""): ParentProfile {
  return {
    firstName: p.prenom,
    lastName: p.nom,
    email,
    phone: p.telephone ?? "",
  }
}

export function mapEleveToChild(eleve: BackendEleveProfile): Child {
  const riasec = eleve.riasecResultat
  return {
    id: eleve.id,
    matricule: eleve.matricule?.code ?? "",
    firstName: eleve.prenom,
    lastName: eleve.nom,
    birthDate: eleve.dateNaissance.slice(0, 10),
    className: eleve.classe?.nom ?? "",
    school: eleve.etablissement?.nom ?? "",
    avatarIcon: resolveAvatarIcon(eleve.avatarUrl),
    riasecDominant: (riasec?.typesPrincipaux ?? []) as RiasecType[],
    riasecScores: riasec ? mapRiasecScores(riasec) : [],
    riasecCompleted: !!riasec,
    suggestedCareerIds: [],
    exploredCareerIds: eleve.metiersExplores?.map((m) => m.metierId) ?? [],
    masteredCareerIds: eleve.metiersModels?.map((m) => m.metierId) ?? [],
    favoriteCareerIds: eleve.favoris?.map((f) => f.metierId) ?? [],
    interestPoints: [],
    progressPercent: Math.min(Math.round((eleve.xpTotal ?? 0) / 10), 100),
    badges: (eleve.badges ?? []).map((b) => ({
      id: b.badge.id,
      name: b.badge.nom,
      description: b.badge.description,
      icon: "trophy",
      dateEarned: b.obtenuAt,
    })),
    activity: [] as ActivityItem[],
    comments: [] as Comment[],
    identityVerified: true,
  }
}

export function mapParentEnfant(relation: BackendParentEnfant): Child {
  return mapEleveToChild(relation.eleve)
}

export function mapCommentaire(c: {
  id: string
  contenu: string
  createdAt: string
  parent?: { prenom: string }
}): Comment {
  return {
    id: c.id,
    author: c.parent?.prenom ?? "Parent",
    date: c.createdAt,
    text: c.contenu,
  }
}

export function defaultNotificationSettings(): NotificationSettings {
  return { frequency: "instant", channels: ["in-app"] }
}

export function mapEleveProfile(p: BackendEleveProfile, role?: string): EleveProfile {
  return {
    id: p.id,
    matricule: p.matricule?.code ?? "",
    firstName: p.prenom,
    lastName: p.nom,
    birthDate: p.dateNaissance.slice(0, 10),
    className: p.classe?.nom ?? "",
    school: p.etablissement?.nom ?? "",
    avatarIcon: resolveAvatarIcon(p.avatarUrl),
    niveau: p.isLycee || role === "ELEVE_LYCEE" ? "lyceen" : "collegien",
  }
}

export function mapEleveProgress(
  data: {
    xpTotal?: number
    badges?: BackendEleveProfile["badges"]
    metiersExplores?: BackendEleveProfile["metiersExplores"]
    metiersModels?: BackendEleveProfile["metiersModels"]
    favoris?: BackendEleveProfile["favoris"]
  },
  riasecCompleted = false,
  missionsTotal = 0,
  missionsCompleted = 0,
): EleveProgress {
  return {
    progressPercent: Math.min(Math.round((data.xpTotal ?? 0) / 10), 100),
    riasecCompleted,
    exploredCareerIds: data.metiersExplores?.map((m) => m.metierId) ?? [],
    masteredCareerIds: data.metiersModels?.map((m) => m.metierId) ?? [],
    favoriteCareerIds: data.favoris?.map((f) => f.metierId) ?? [],
    badges: (data.badges ?? []).map(
      (b): EleveBadge => ({
        id: b.badge.id,
        name: b.badge.nom,
        description: b.badge.description,
        icon: "trophy",
        dateEarned: b.obtenuAt,
      }),
    ),
    missionsCompleted,
    missionsTotal,
  }
}

export function mapMission(m: BackendMission, riasecDone: boolean): EleveMission {
  const isRiasec = m.titre.toLowerCase().includes("riasec")
  return {
    id: m.id,
    type: isRiasec ? "riasec" : "quiz",
    title: m.titre,
    description: m.description,
    careerId: m.metierId,
    careerTitle: m.metier?.nom,
    status: isRiasec && !riasecDone ? "locked" : "available",
    stepsTotal: m.etapes?.length ?? 3,
    stepsCompleted: 0,
    badgeName: m.metier ? `Métier maîtrisé — ${m.metier.nom}` : undefined,
  }
}

export function mapMissionProgress(p: BackendMissionProgress): EleveMission {
  const completed = p.etapes?.filter((e) => e.isComplete).length ?? 0
  return {
    id: p.mission.id,
    type: "quiz",
    title: p.mission.titre,
    description: p.mission.description,
    careerId: p.mission.metierId,
    careerTitle: p.mission.metier?.nom,
    status: p.isComplete ? "completed" : "in_progress",
    stepsTotal: p.mission.etapes?.length ?? p.etapes?.length ?? 3,
    stepsCompleted: completed,
    badgeName: p.isComplete ? `Métier maîtrisé — ${p.mission.metier?.nom}` : undefined,
  }
}

export function mapEleveNotification(n: BackendNotification): EleveNotification {
  return {
    id: n.id,
    date: n.createdAt,
    title: n.titre,
    message: n.message,
    read: n.isRead,
  }
}

export function mapDashboard(data: {
  totalEleves: number
  elevesActifs: number
  elevesInactifs?: number
  progressionMoyenne: number
  metiersPopulaires?: Array<{ metierId?: string; nom?: string; domaine?: string; _count: number }>
  domainesTopExplores?: Array<{ nom: string; nbExplorations: number }>
}): DashboardOverview {
  return {
    elevesActifs: data.elevesActifs,
    elevesInactifs: data.elevesInactifs ?? Math.max(0, data.totalEleves - data.elevesActifs),
    progressionMoyennePct: Math.min(Math.round(data.progressionMoyenne / 10), 100),
    domainesTopExplores: data.domainesTopExplores ?? [],
    metiersTopConsultes: (data.metiersPopulaires ?? []).map((m, i) => ({
      nom: m.nom ?? `Métier ${i + 1}`,
      domaine: m.domaine ?? "",
      nbConsultations: m._count,
    })),
    derniereMiseAJour: new Date().toISOString(),
  }
}

export function mapEleveEtablissement(e: BackendEleveProfile): Eleve {
  return {
    id: e.id,
    matricule: e.matricule?.code ?? "",
    nom: e.nom,
    prenom: e.prenom,
    classeId: e.classe?.id ?? "",
    classeNom: e.classe?.nom ?? "",
    statut: "actif",
    riasecComplete: !!e.riasecResultat,
    progressionPct: Math.min(Math.round((e.xpTotal ?? 0) / 10), 100),
    badgesObtenus: e.badges?.length ?? 0,
    dateInscription: e.dateNaissance.slice(0, 10),
  }
}

export function mapClasse(c: {
  id: string
  nom: string
  niveau: string
  eleves?: unknown[]
}): Classe {
  return {
    id: c.id,
    nom: c.nom,
    niveau: c.niveau,
    effectif: c.eleves?.length ?? 0,
  }
}

export function mapMatricule(m: {
  id: string
  code: string
  status: string
  createdAt: string
  eleveProfile?: { prenom: string; nom: string } | null
}): Matricule {
  return {
    id: m.id,
    code: m.code,
    statut: m.status === "UTILISE" ? "utilise" : "non_utilise",
    dateGeneration: m.createdAt,
    classeNom: m.eleveProfile ? `${m.eleveProfile.prenom} ${m.eleveProfile.nom}` : undefined,
  }
}

export function mapSubscription(sub: {
  plan: string
  maxLicences: number
  licencesUsed: number
  endDate: string
  invoices?: Array<{ id: string; amount: number; paidAt?: string | null; invoiceUrl?: string | null; createdAt: string }>
} | null): Abonnement | null {
  if (!sub) return null
  const planMap: Record<string, Abonnement["formule"]> = {
    ESSENTIEL: "decouverte",
    STANDARD: "standard",
    PREMIUM: "etablissement_plus",
  }
  return {
    formule: planMap[sub.plan] ?? "standard",
    licencesUtilisees: sub.licencesUsed,
    licencesTotal: sub.maxLicences,
    dateExpiration: sub.endDate,
    factures: (sub.invoices ?? []).map((inv) => ({
      id: inv.id,
      periode: new Date(inv.createdAt).getFullYear().toString(),
      montantFcfa: inv.amount,
      statut: inv.paidAt ? "payee" : "en_attente",
      url: inv.invoiceUrl ?? "#",
    })),
  }
}

export function mapEtablissementParametres(p: {
  nom: string
  description?: string | null
  logoUrl?: string | null
  telephone?: string | null
  email?: string | null
  adresse?: string | null
  slug?: string
  pagePublique?: {
    filieres?: string[]
    statsPubliques?: { resultatsExamens?: ParametresEtablissement["resultatsExamens"] } | null
  } | null
}): ParametresEtablissement {
  return {
    nom: p.nom,
    description: p.description ?? "",
    logoUrl: p.logoUrl ?? null,
    telephone: p.telephone ?? "",
    email: p.email ?? "",
    adresse: p.adresse ?? "",
    filieres: p.pagePublique?.filieres ?? [],
    resultatsExamens: p.pagePublique?.statsPubliques?.resultatsExamens ?? [],
    lienPublic: p.slug ? `/etablissements/${p.slug}` : "",
  }
}

export function mapReports(
  reports: Array<{ classe: string; totalEleves: number; elevesAvecRiasec: number }>,
): Rapport[] {
  return reports.map((r, i) => ({
    id: `rapport-${i}`,
    type: "classe" as const,
    cibleNom: r.classe,
    dateGeneration: new Date().toISOString(),
    url: "#",
  }))
}

export function mapMetierPublic(m: BackendMetier) {
  return {
    id: m.id,
    slug: m.slug,
    titre: m.nom,
    domaineId: m.domaineId,
    domaineNom: m.domaine?.nom ?? "",
    description: m.descriptionCourte || m.description,
    ceQuIlFait: m.description,
    tachesQuotidiennes: [] as string[],
    competences: m.riasecTypes ?? [],
    videoUrl: m.videoUrl ?? undefined,
  }
}