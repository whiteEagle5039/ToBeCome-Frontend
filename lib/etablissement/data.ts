import fs from "fs"
import path from "path"

const dataDir = path.join(process.cwd(), "data")

function readJSON<T>(filename: string): T[] {
  const filePath = path.join(dataDir, filename)
  if (!fs.existsSync(filePath)) return []
  const raw = fs.readFileSync(filePath, "utf-8")
  return raw ? JSON.parse(raw) : []
}

function writeJSON<T>(filename: string, data: T[]) {
  const filePath = path.join(dataDir, filename)
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}

export type EtablissementRequest = {
  id: string
  nomEtablissement: string
  ville: string
  email: string
  telephone?: string
  message?: string
  status: "PENDING" | "APPROVED" | "ACTIVE" | "SUSPENDED" | "REJECTED"
  createdAt: string
  processedAt?: string
}

export const etablissementsDB = {
  getAll: () => readJSON<EtablissementRequest>("etablissements.json"),
  save: (all: EtablissementRequest[]) => writeJSON("etablissements.json", all),
}