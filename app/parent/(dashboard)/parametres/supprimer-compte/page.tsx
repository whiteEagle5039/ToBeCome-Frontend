"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, TriangleAlert } from "lucide-react";
import { clearAllTokens } from "@/lib/api/client";

/**
 * Suppression de compte : demande explicite adressée à l'équipe.
 * La suppression définitive des données est un acte irréversible traité
 * manuellement — l'utilisateur est déconnecté après sa demande.
 */
export default function SupprimerComptePage() {
  const [confirmation, setConfirmation] = useState("");
  const [envoye, setEnvoye] = useState(false);

  const demander = () => {
    clearAllTokens();
    setEnvoye(true);
  };

  if (envoye) {
    return (
      <div className="mx-auto max-w-xl px-4 py-8">
        <h1 className="text-2xl font-bold text-neutral-900">Demande enregistrée</h1>
        <p className="mt-3 text-sm text-neutral-600">
          Votre demande de suppression a été prise en compte et votre session a
          été fermée. Pour confirmer la suppression définitive de vos données,
          écrivez-nous à{" "}
          <a href="mailto:contact@tobecome.africa" className="font-medium text-teal-700 underline">
            contact@tobecome.africa
          </a>{" "}
          depuis l'adresse e-mail de votre compte.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-teal-700 px-6 py-3 font-semibold text-white hover:bg-teal-800"
        >
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <Link
        href="/parent/parametres"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Paramètres
      </Link>

      <div className="mt-4 flex items-center gap-2">
        <TriangleAlert className="h-6 w-6 text-red-600" />
        <h1 className="text-2xl font-bold text-neutral-900">Supprimer mon compte</h1>
      </div>
      <p className="mt-3 text-sm text-neutral-600">
        Cette action est définitive : votre profil, vos liens avec vos enfants
        et votre historique seront supprimés. Vos enfants conservent leur
        compte élève.
      </p>

      <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">
        <label className="text-sm font-medium text-neutral-800">
          Pour confirmer, écrivez <span className="font-bold">SUPPRIMER</span> ci-dessous :
        </label>
        <input
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          className="mt-2 w-full rounded-xl border border-red-200 bg-white px-4 py-3"
        />
        <button
          onClick={demander}
          disabled={confirmation.trim().toUpperCase() !== "SUPPRIMER"}
          className="mt-4 w-full rounded-full bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700 disabled:opacity-40"
        >
          Demander la suppression
        </button>
      </div>
    </div>
  );
}
