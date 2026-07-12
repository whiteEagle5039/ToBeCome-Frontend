"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { api } from "@/lib/api/client";
import { logoutParent } from "@/lib/api/auth";

export default function ParametresProfilPage() {
  const router = useRouter();
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [chargement, setChargement] = useState(true);
  const [enregistrement, setEnregistrement] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/api/parent/profile")
      .then(({ data }) => {
        setPrenom(data?.prenom ?? "");
        setNom(data?.nom ?? "");
        setTelephone(data?.telephone ?? "");
      })
      .catch(() => {})
      .finally(() => setChargement(false));
  }, []);

  const enregistrer = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnregistrement(true);
    setMessage(null);
    try {
      await api.put("/api/parent/profile", { prenom, nom, telephone });
      setMessage("Profil mis à jour.");
    } catch {
      setMessage("Impossible d'enregistrer. Réessayez.");
    } finally {
      setEnregistrement(false);
    }
  };

  const handleLogout = async () => {
    logoutParent();
    router.push("/parent/login");
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

      <h1 className="mt-4 text-2xl font-bold text-neutral-900">Mon profil</h1>

      {chargement ? (
        <p className="mt-8 text-sm text-neutral-500">Chargement…</p>
      ) : (
        <form onSubmit={enregistrer} className="mt-8 space-y-4">
          <div>
            <label className="text-sm font-medium text-neutral-700">Prénom</label>
            <input
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              required
              className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700">Nom</label>
            <input
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
              className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700">Téléphone</label>
            <input
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              placeholder="+229..."
              className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3"
            />
          </div>

          {message && <p className="text-sm text-teal-700">{message}</p>}

          <button
            type="submit"
            disabled={enregistrement}
            className="w-full rounded-full bg-teal-700 px-6 py-3 font-semibold text-white transition hover:bg-teal-800 disabled:opacity-60"
          >
            {enregistrement ? "Enregistrement…" : "Enregistrer"}
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-full bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
          >
            Se déconnecter
          </button>
        </form>
      )}
    </div>
  );
}
