"use client";

import { useState } from "react";
import { CheckCircle2, Download, Loader2 } from "lucide-react";
import { Button, Card } from "@/components/parent/ui";
import { SettingsSubHeader } from "@/components/parent/SettingsSubHeader";

type Status = "idle" | "loading" | "success" | "error";

export default function TelechargerDonneesPage() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleExport() {
    setStatus("loading");
    try {
      const res = await fetch("/api/parent/export-donnees", { method: "POST" });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div>
      <SettingsSubHeader
        icon={Download}
        title="Télécharger mes données"
        subtitle="Reçois une copie de toutes tes données et celles de tes enfants."
      />

      <Card className="mx-auto mt-6 max-w-2xl p-6">
        <p className="text-sm text-ink">
          Cela inclut ton profil, les profils de tes enfants reliés à ton compte, leurs résultats
          RIASEC, badges et métiers explorés. L&apos;export est préparé puis envoyé par email à
          l&apos;adresse de ton compte.
        </p>

        {status === "success" ? (
          <p className="mt-4 flex items-center gap-1.5 text-sm font-medium text-teal-700">
            <CheckCircle2 size={16} /> Demande envoyée — tu recevras un email sous peu.
          </p>
        ) : (
          <Button onClick={handleExport} disabled={status === "loading"} className="mt-4">
            {status === "loading" ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            Demander l&apos;export de mes données
          </Button>
        )}

        {status === "error" && (
          <p className="mt-3 text-xs font-medium text-red-600">
            Un problème est survenu. Réessaie dans un instant.
          </p>
        )}
      </Card>
    </div>
  );
}