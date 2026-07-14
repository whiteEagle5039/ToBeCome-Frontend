import * as XLSX from "xlsx"
import type { BackendEleveRole } from "@/lib/api/client"
import type { ImportElevePayload } from "@/lib/api/etablissement"
import type { Classe } from "@/types/etablissement"

export interface ParsedEleveRow {
  ligne: number
  prenom: string
  nom: string
  dateNaissance: string
  classeSaisie: string
  classeId: string | null
  role: BackendEleveRole
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

function normalizeRow(row: Record<string, unknown>, ligne: number, classes: Classe[]): ParsedEleveRow {
  const fields: Partial<Record<Field, string>> = {}
  for (const [key, value] of Object.entries(row)) {
    const field = HEADER_MAP[normalizeHeader(key)]
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

  return {
    ligne,
    prenom,
    nom,
    dateNaissance,
    classeSaisie,
    classeId: classe?.id ?? null,
    role,
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
  return {
    prenom: row.prenom,
    nom: row.nom,
    dateNaissance: row.dateNaissance,
    classeId: row.classeId as string,
    role: row.role,
  }
}

export function downloadEleveTemplate(classes: Classe[]) {
  const exempleClasse = classes[0]?.nom ?? "6ème A"
  const sheetData = [
    ["prenom", "nom", "dateNaissance", "classe", "role"],
    ["Jean", "Dupont", "2009-05-12", exempleClasse, "ELEVE_COLLEGE"],
  ]
  const workbook = XLSX.utils.book_new()
  const sheet = XLSX.utils.aoa_to_sheet(sheetData)
  sheet["!cols"] = [{ wch: 14 }, { wch: 14 }, { wch: 16 }, { wch: 18 }, { wch: 16 }]
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
