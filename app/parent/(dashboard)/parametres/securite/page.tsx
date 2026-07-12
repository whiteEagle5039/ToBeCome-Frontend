"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { api, getApiErrorMessage } from "@/lib/api/client";

export default function ParametresSecuritePage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [enregistrement, setEnregistrement] = useState(false);
  const [message, setMessage] = useState<{ texte: string; erreur: boolean } | null>(null);

  const enregistrer = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword.length < 8) {
      setMessage({ texte: "Le nouveau mot de passe doit faire au moins 8 caractères.", erreur: true });
      return;
    }
    if (newPassword !== confirmation) {
      setMessage({ texte: "La confirmation ne correspond pas.", erreur: true });
      return;
    }

    setEnregistrement(true);
    try {
      await api.put("/api/parent/password", { currentPassword, newPassword });
      setMessage({ texte: "Mot de passe modifié.", erreur: false });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmation("");
    } catch (err) {
      setMessage({ texte: getApiErrorMessage(err, "Modification impossible."), erreur: true });
    } finally {
      setEnregistrement(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <Link
        href="/parent/parametres"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Paramètres
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-neutral-900">Sécurité</h1>
      <p className="mt-1 text-sm text-neutral-500">Modifiez votre mot de passe.</p>

      <form onSubmit={enregistrer} className="mt-8 space-y-4">
        <div>
          <label className="text-sm font-medium text-neutral-700">Mot de passe actuel</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-neutral-700">Nouveau mot de passe</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            autoComplete="new-password"
            className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-neutral-700">Confirmer le nouveau mot de passe</label>
          <input
            type="password"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            required
            autoComplete="new-password"
            className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3"
          />
        </div>

        {message && (
          <p className={`text-sm ${message.erreur ? "text-red-600" : "text-teal-700"}`}>
            {message.texte}
          </p>
        )}

        <button
          type="submit"
          disabled={enregistrement}
          className="w-full rounded-full bg-teal-700 px-6 py-3 font-semibold text-white transition hover:bg-teal-800 disabled:opacity-60"
        >
          {enregistrement ? "Modification…" : "Modifier le mot de passe"}
        </button>
      </form>
    </div>
  );
}
