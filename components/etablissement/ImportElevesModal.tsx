"use client";

import { ChangeEvent, useState } from "react";
import { AlertTriangle, CheckCircle2, Download, FileSpreadsheet, Loader2, UploadCloud, XCircle } from "lucide-react";
import { Modal } from "@/components/etablissement/Modal";
import { Badge } from "@/components/etablissement/Badge";
import type { Classe } from "@/types/etablissement";
import { importEleves, type ImportElevesResponse } from "@/lib/api/etablissement";
import { getApiErrorMessage } from "@/lib/api/client";
import { downloadEleveTemplate, parseElevesFile, rowToPayload, type ParsedEleveRow } from "@/lib/etablissement/import-eleves";

type Step = "select" | "preview" | "result";

interface ImportElevesModalProps {
  open: boolean;
  onClose: () => void;
  classes: Classe[];
  onImported: () => void;
}

export function ImportElevesModal({ open, onClose, classes, onImported }: ImportElevesModalProps) {
  const [step, setStep] = useState<Step>("select");
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<ParsedEleveRow[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [result, setResult] = useState<ImportElevesResponse | null>(null);
  const [sentRows, setSentRows] = useState<ParsedEleveRow[]>([]);

  function reset() {
    setStep("select");
    setFileName("");
    setRows([]);
    setParseError(null);
    setImporting(false);
    setImportError(null);
    setResult(null);
    setSentRows([]);
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setParseError(null);
    setFileName(file.name);
    try {
      const parsed = await parseElevesFile(file, classes);
      if (parsed.length === 0) {
        setParseError("Aucune ligne exploitable n'a été trouvée dans ce fichier.");
        return;
      }
      setRows(parsed);
      setStep("preview");
    } catch {
      setParseError("Impossible de lire ce fichier. Vérifie qu'il s'agit bien d'un fichier Excel (.xlsx, .xls) ou CSV.");
    }
  }

  function updateRowClasse(ligne: number, classeId: string) {
    setRows((prev) =>
      prev.map((r) => {
        if (r.ligne !== ligne) return r;
        const classe = classes.find((c) => c.id === classeId);
        const erreurs = r.erreurs.filter((err) => !err.toLowerCase().includes("classe"));
        return { ...r, classeId: classe?.id ?? null, classeSaisie: classe?.nom ?? r.classeSaisie, erreurs };
      }),
    );
  }

  const validRows = rows.filter((r) => r.erreurs.length === 0 && r.classeId);
  const invalidRows = rows.filter((r) => r.erreurs.length > 0 || !r.classeId);

  async function handleImport() {
    if (validRows.length === 0) return;
    setImporting(true);
    setImportError(null);
    try {
      const payload = validRows.map(rowToPayload);
      const response = await importEleves(payload);
      setSentRows(validRows);
      setResult(response);
      setStep("result");
    } catch (err) {
      setImportError(getApiErrorMessage(err, "L'import a échoué. Réessaie dans un instant."));
    } finally {
      setImporting(false);
    }
  }

  function handleFinish() {
    onImported();
    handleClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Importer des élèves"
      footer={
        step === "preview" ? (
          <>
            <button
              onClick={() => setStep("select")}
              className="rounded-xl px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50"
            >
              Retour
            </button>
            <button
              onClick={handleImport}
              disabled={validRows.length === 0 || importing}
              className="flex items-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2 text-sm font-medium text-white hover:bg-[#0c5f59] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {importing && <Loader2 className="h-4 w-4 animate-spin" />}
              Importer {validRows.length > 0 ? `(${validRows.length})` : ""}
            </button>
          </>
        ) : step === "result" ? (
          <button
            onClick={handleFinish}
            className="rounded-xl bg-[#0F766E] px-4 py-2 text-sm font-medium text-white hover:bg-[#0c5f59]"
          >
            Terminer
          </button>
        ) : undefined
      }
    >
      {step === "select" && (
        <div className="space-y-4">
          <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-4 py-8 text-center hover:bg-slate-50">
            <UploadCloud className="h-7 w-7 text-[#0F766E]" />
            <span className="text-sm font-medium text-slate-700">Sélectionner un fichier</span>
            <span className="text-xs text-slate-400">Excel (.xlsx, .xls) ou CSV</span>
            <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleFileChange} />
          </label>

          {fileName && !parseError && <p className="text-xs text-slate-500">Fichier sélectionné : {fileName}</p>}

          {parseError && (
            <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-700">
              <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{parseError}</span>
            </div>
          )}

          <button
            onClick={() => downloadEleveTemplate(classes)}
            className="flex items-center gap-2 text-sm font-medium text-[#0F766E] hover:underline"
          >
            <Download className="h-4 w-4" /> Télécharger le modèle Excel
          </button>

          <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
            Colonnes attendues : <span className="font-medium text-slate-700">prenom</span>,{" "}
            <span className="font-medium text-slate-700">nom</span>,{" "}
            <span className="font-medium text-slate-700">dateNaissance</span> (AAAA-MM-JJ),{" "}
            <span className="font-medium text-slate-700">classe</span> (nom de la classe). La colonne{" "}
            <span className="font-medium text-slate-700">role</span> est optionnelle (déduite du niveau de la classe
            si absente). Un matricule sera généré automatiquement pour chaque élève.
          </div>
        </div>
      )}

      {step === "preview" && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Badge label={`${validRows.length} valide(s)`} tone="success" />
            {invalidRows.length > 0 && <Badge label={`${invalidRows.length} en erreur`} tone="danger" />}
            <span className="text-xs text-slate-400">{fileName}</span>
          </div>

          {importError && (
            <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-700">
              <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{importError}</span>
            </div>
          )}

          <div className="max-h-80 overflow-y-auto rounded-xl border border-slate-100">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 border-b border-slate-100 bg-slate-50 uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-3 py-2">Ligne</th>
                  <th className="px-3 py-2">Élève</th>
                  <th className="px-3 py-2">Naissance</th>
                  <th className="px-3 py-2">Classe</th>
                  <th className="px-3 py-2">Rôle</th>
                  <th className="px-3 py-2">Statut</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const ok = r.erreurs.length === 0 && r.classeId;
                  return (
                    <tr key={r.ligne} className="border-b border-slate-50">
                      <td className="px-3 py-2 text-slate-400">{r.ligne}</td>
                      <td className="px-3 py-2 font-medium text-slate-700">
                        {r.prenom || "—"} {r.nom}
                      </td>
                      <td className="px-3 py-2 text-slate-500">{r.dateNaissance || "—"}</td>
                      <td className="px-3 py-2">
                        {r.classeId ? (
                          <span className="text-slate-600">{r.classeSaisie}</span>
                        ) : (
                          <select
                            value=""
                            onChange={(e) => updateRowClasse(r.ligne, e.target.value)}
                            className="rounded-lg border border-rose-200 bg-rose-50 px-1.5 py-1 text-xs text-rose-700 outline-none"
                          >
                            <option value="">Choisir une classe…</option>
                            {classes.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.nom}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td className="px-3 py-2 text-slate-500">{r.role === "ELEVE_LYCEE" ? "Lycée" : "Collège"}</td>
                      <td className="px-3 py-2">
                        {ok ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <span className="flex items-center gap-1 text-rose-600">
                            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                            {r.erreurs.join(", ")}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {step === "result" && result && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm text-emerald-700">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {result.imported} élève(s) importé(s) avec succès.
          </div>

          <div className="max-h-72 overflow-y-auto rounded-xl border border-slate-100">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 border-b border-slate-100 bg-slate-50 uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-3 py-2">Élève</th>
                  <th className="px-3 py-2">Matricule</th>
                  <th className="px-3 py-2">Statut</th>
                </tr>
              </thead>
              <tbody>
                {result.results.map((res, i) => {
                  const row = sentRows[i];
                  return (
                    <tr key={i} className="border-b border-slate-50">
                      <td className="px-3 py-2 font-medium text-slate-700">
                        {row ? `${row.prenom} ${row.nom}` : res.success ? "—" : res.name ?? "—"}
                      </td>
                      <td className="px-3 py-2 font-mono text-slate-600">
                        {res.success ? res.matricule : "—"}
                      </td>
                      <td className="px-3 py-2">
                        {res.success ? (
                          <span className="flex items-center gap-1 text-emerald-600">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Créé
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-rose-600">
                            <XCircle className="h-3.5 w-3.5 shrink-0" /> {res.error}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {step === "select" && rows.length === 0 && fileName === "" && (
        <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
          <FileSpreadsheet className="h-3.5 w-3.5" /> Le fichier reste sur ton appareil : seules les lignes valides
          sont envoyées lors de l&apos;import.
        </div>
      )}
    </Modal>
  );
}
