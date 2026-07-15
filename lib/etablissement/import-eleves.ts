import * as XLSX from "xlsx"
import type { BackendEleveRole } from "@/lib/api/client"
import type { ImportElevePayload } from "@/lib/api/etablissement"
import type { Classe } from "@/types/etablissement"

export interface ParsedParent {
  prenom: string
  nom: string
  email: string
  telephone: string
  lienParente: string
}

export interface ParsedEleveRow {
  ligne: number
  prenom: string
  nom: string
  dateNaissance: string
  classeSaisie: string
  classeId: string | null
  role: BackendEleveRole
  parents: ParsedParent[]
  erreurs: string[]
}

type Field = "prenom" | "nom" | "dateNaissance" | "classe" | "role"

const HEADER_MAP: Record<string, Field> = {
  prenom: "prenom",
  firstname: "prenom",
  first_name: "prenom",
  nom: "nom",
  lastname: "nom",
  last_name: "nom",
  datenaissance: "dateNaissance",
  datedenaissance: "dateNaissance",
  ddn: "dateNaissance",
  naissance: "dateNaissance",
  birthdate: "dateNaissance",
  birth_date: "dateNaissance",
  classe: "classe",
  classeid: "classe",
  class: "classe",
  role: "role",
  niveau: "role",
}

type ParentField = "prenom" | "nom" | "email" | "telephone" | "lien"

const PARENT_FIELD_SUFFIXES: Record<string, ParentField> = {
  prenom: "prenom",
  firstname: "prenom",
  nom: "nom",
  lastname: "nom",
  email: "email",
  mail: "email",
  telephone: "telephone",
  tel: "telephone",
  phone: "telephone",
  lien: "lien",
  lienparente: "lien",
  lienparent: "lien",
  relation: "lien",
}

interface ParentSlotDef {
  prefixes: string[]
  defaultLien: string
}

const PARENT_SLOTS: ParentSlotDef[] = [
  { prefixes: ["parent1", "parenta", "pere"], defaultLien: "Père" },
  { prefixes: ["parent2", "parentb", "mere"], defaultLien: "Mère" },
]

function normalizeHeader(header: string): string {
  return header
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, "")
}

function cellToString(value: unknown): string {
  if (value instanceof Date) {
    const y = value.getFullYear()
    const m = String(value.getMonth() + 1).padStart(2, "0")
    const d = String(value.getDate()).padStart(2, "0")
    return `${y}-${m}-${d}`
  }
  return String(value ?? "").trim()
}

function normalizeDate(value: string): string {
  if (!value) return ""
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10)
  const match = value.match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})$/)
  if (match) {
    const [, d, m, y] = match
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`
  }
  return ""
}

function resolveClasse(classeSaisie: string, classes: Classe[]): Classe | undefined {
  if (!classeSaisie) return undefined
  return (
    classes.find((c) => c.id === classeSaisie) ??
    classes.find((c) => c.nom.trim().toLowerCase() === classeSaisie.trim().toLowerCase())
  )
}

function resolveRole(roleSaisi: string, classe: Classe | undefined): BackendEleveRole {
  const normalized = roleSaisi.trim().toUpperCase()
  if (normalized.includes("LYC")) return "ELEVE_LYCEE"
  if (normalized.includes("COLLEGE") || normalized.includes("COLLÈGE")) return "ELEVE_COLLEGE"
  if (classe?.niveau?.toLowerCase().includes("lyc")) return "ELEVE_LYCEE"
  return "ELEVE_COLLEGE"
}

function matchParentColumn(normalizedHeader: string): { slot: number; field: ParentField } | null {
  for (let slot = 0; slot < PARENT_SLOTS.length; slot++) {
    for (const prefix of PARENT_SLOTS[slot].prefixes) {
      if (!normalizedHeader.startsWith(prefix)) continue
      const suffix = normalizedHeader.slice(prefix.length)
      const field = PARENT_FIELD_SUFFIXES[suffix]
      if (field) return { slot, field }
    }
  }
  return null
}

function buildParents(
  parentFields: Array<Partial<Record<ParentField, string>>>,
  erreurs: string[],
): ParsedParent[] {
  const parents: ParsedParent[] = []
  parentFields.forEach((fields, slot) => {
    const hasAnyValue = Object.values(fields).some((v) => v && v.trim())
    if (!hasAnyValue) return
    const email = (fields.email ?? "").trim()
    if (!email) {
      erreurs.push(`Email du parent ${slot + 1} manquant`)
      return
    }
    parents.push({
      prenom: (fields.prenom ?? "").trim(),
      nom: (fields.nom ?? "").trim(),
      email,
      telephone: (fields.telephone ?? "").trim(),
      lienParente: (fields.lien ?? "").trim() || PARENT_SLOTS[slot].defaultLien,
    })
  })
  return parents
}

function normalizeRow(row: Record<string, unknown>, ligne: number, classes: Classe[]): ParsedEleveRow {
  const fields: Partial<Record<Field, string>> = {}
  const parentFields: Array<Partial<Record<ParentField, string>>> = PARENT_SLOTS.map(() => ({}))

  for (const [key, value] of Object.entries(row)) {
    const normalized = normalizeHeader(key)
    const parentMatch = matchParentColumn(normalized)
    if (parentMatch) {
      parentFields[parentMatch.slot][parentMatch.field] = cellToString(value)
      continue
    }
    const field = HEADER_MAP[normalized]
    if (!field) continue
    fields[field] = cellToString(value)
  }

  const prenom = fields.prenom ?? ""
  const nom = fields.nom ?? ""
  const dateNaissance = normalizeDate(fields.dateNaissance ?? "")
  const classeSaisie = fields.classe ?? ""
  const classe = resolveClasse(classeSaisie, classes)
  const role = resolveRole(fields.role ?? "", classe)

  const erreurs: string[] = []
  if (!prenom) erreurs.push("Prénom manquant")
  if (!nom) erreurs.push("Nom manquant")
  if (!dateNaissance) erreurs.push("Date de naissance invalide (attendu AAAA-MM-JJ ou JJ/MM/AAAA)")
  if (!classeSaisie) erreurs.push("Classe manquante")
  else if (!classe) erreurs.push(`Classe "${classeSaisie}" introuvable`)

  const parents = buildParents(parentFields, erreurs)

  return {
    ligne,
    prenom,
    nom,
    dateNaissance,
    classeSaisie,
    classeId: classe?.id ?? null,
    role,
    parents,
    erreurs,
  }
}

export async function parseElevesFile(file: File, classes: Classe[]): Promise<ParsedEleveRow[]> {
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: "array", cellDates: true })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  if (!sheet) return []
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" })
  return rows.map((row, index) => normalizeRow(row, index + 2, classes))
}

export function rowToPayload(row: ParsedEleveRow): ImportElevePayload {
  const payload: ImportElevePayload = {
    prenom: row.prenom,
    nom: row.nom,
    dateNaissance: row.dateNaissance,
    classeId: row.classeId as string,
    role: row.role,
  }
  if (row.parents.length > 0) {
    payload.parents = row.parents.map((p) => ({
      prenom: p.prenom,
      nom: p.nom,
      email: p.email,
      telephone: p.telephone,
      lienParente: p.lienParente,
    }))
  }
  return payload
}

export function downloadEleveTemplate(classes: Classe[]) {
  const exempleClasse = classes[0]?.nom ?? "6ème A"
  const sheetData = [
    [
      "prenom",
      "nom",
      "dateNaissance",
      "classe",
      "role",
      "parent1Prenom",
      "parent1Nom",
      "parent1Email",
      "parent1Telephone",
      "parent1Lien",
    ],
    [
      "Jean",
      "Dupont",
      "2009-05-12",
      exempleClasse,
      "ELEVE_COLLEGE",
      "Paul",
      "Dupont",
      "paul.dupont@example.com",
      "+229 90 00 00 00",
      "Père",
    ],
  ]
  const workbook = XLSX.utils.book_new()
  const sheet = XLSX.utils.aoa_to_sheet(sheetData)
  sheet["!cols"] = [
    { wch: 14 },
    { wch: 14 },
    { wch: 16 },
    { wch: 18 },
    { wch: 16 },
    { wch: 14 },
    { wch: 14 },
    { wch: 24 },
    { wch: 18 },
    { wch: 12 },
  ]
  XLSX.utils.book_append_sheet(workbook, sheet, "Élèves")

  if (classes.length) {
    const classesSheet = XLSX.utils.aoa_to_sheet([
      ["Classes disponibles"],
      ...classes.map((c) => [c.nom]),
    ])
    XLSX.utils.book_append_sheet(workbook, classesSheet, "Classes")
  }

  XLSX.writeFile(workbook, "modele-import-eleves.xlsx")
}
