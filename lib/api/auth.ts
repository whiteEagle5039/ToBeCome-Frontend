import { api, setToken, clearToken, setEleveRole, getEleveRole, type BackendEleveRole } from "./client"
import type { ParentProfile } from "@/lib/parent/types"

export interface AuthResponse {
  token: string
  user: {
    id: string
    email?: string | null
    role: string
    profile?: Record<string, unknown>
  }
}

export interface EleveRegisterInput {
  matricule: string
  birthDate: string
  password: string
  firstName: string
  lastName: string
  avatarIcon?: string
  niveau: "collegien" | "lyceen"
}

export interface EtablissementRegisterInput {
  nomEtablissement: string
  ville: string
  email: string
  password: string
  telephone?: string
  message?: string
}

function eleveRoleFromNiveau(niveau: "collegien" | "lyceen"): BackendEleveRole {
  return niveau === "lyceen" ? "ELEVE_LYCEE" : "ELEVE_COLLEGE"
}

function syntheticEleveEmail(matricule: string): string {
  const clean = matricule.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()
  return `${clean}@eleve.tobecome.bj`
}

// ─── Parent ───────────────────────────────────────────────────────────────────

export async function loginParent(email: string, password: string) {
  const { data } = await api.post<AuthResponse>("/api/auth/login", {
    email,
    password,
    role: "PARENT",
  })
  setToken("parent", data.token)
  return data
}

export async function registerParent(profile: ParentProfile & { password: string }) {
  await api.post("/api/auth/register", {
    email: profile.email,
    password: profile.password,
    role: "PARENT",
    prenom: profile.firstName,
    nom: profile.lastName,
    telephone: profile.phone,
  })
  return loginParent(profile.email, profile.password)
}

export async function forgotPasswordParent(email: string) {
  await api.post("/api/auth/forgot-password", { email })
  return { message: "Si un compte existe, un email a été envoyé." }
}

export function logoutParent() {
  clearToken("parent")
}

// ─── Élève ────────────────────────────────────────────────────────────────────

export async function loginEleve(
  matricule: string,
  password: string,
  role?: BackendEleveRole,
) {
  const stored = getEleveRole()
  const rolesToTry: BackendEleveRole[] = role
    ? [role]
    : stored
      ? [stored]
      : ["ELEVE_COLLEGE", "ELEVE_LYCEE"]

  let lastError: unknown
  for (const eleveRole of rolesToTry) {
    try {
      const { data } = await api.post<AuthResponse>("/api/auth/login", {
        matricule: matricule.trim().toUpperCase(),
        password,
        role: eleveRole,
      })
      setToken("eleve", data.token)
      setEleveRole(eleveRole)
      return data
    } catch (err) {
      lastError = err
    }
  }
  throw lastError
}

export async function registerEleve(input: EleveRegisterInput) {
  const role = eleveRoleFromNiveau(input.niveau)
  const email = syntheticEleveEmail(input.matricule)

  await api.post("/api/auth/register", {
    email,
    password: input.password,
    role,
    matricule: input.matricule.trim().toUpperCase(),
    prenom: input.firstName,
    nom: input.lastName,
    dateNaissance: input.birthDate,
  })

  return loginEleve(input.matricule, input.password, role)
}

export async function verifyMatricule(
  matricule: string,
  birthDate: string,
  mode: "register" | "link" = "register",
) {
  const { data } = await api.post<{
    valid: boolean
    error?: string
    firstName?: string
    lastName?: string
    birthDate?: string
    className?: string
    school?: string
    eleveId?: string
  }>("/api/auth/verify-matricule", {
    matricule: matricule.trim().toUpperCase(),
    dateNaissance: birthDate,
    mode,
  })
  return data
}

export function logoutEleve() {
  clearToken("eleve")
}

// ─── Établissement ────────────────────────────────────────────────────────────

export async function loginEtablissement(email: string, password: string) {
  const { data } = await api.post<AuthResponse>("/api/auth/login", {
    email,
    password,
    role: "ETABLISSEMENT",
  })
  setToken("etablissement", data.token)
  return data
}

export async function registerEtablissement(input: EtablissementRegisterInput) {
  // 1) Création du compte (le backend n'accepte que "prenom" pour le nom de l'établissement)
  await api.post("/api/auth/register", {
    email: input.email,
    password: input.password,
    role: "ETABLISSEMENT",
    prenom: input.nomEtablissement,
  })

  // 2) Connexion immédiate pour obtenir un token (nécessaire pour compléter le profil)
  const authData = await loginEtablissement(input.email, input.password)

  // 3) Complète le profil avec les infos supplémentaires du formulaire
  await api.put("/api/etablissement/profile", {
    ville: input.ville,
    telephone: input.telephone,
    email: input.email,
    description: input.message,
  })

  return authData
}

export function logoutEtablissement() {
  clearToken("etablissement")
}