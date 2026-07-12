"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { api } from "@/lib/api/client";

const CANAUX = [
  { valeur: "PUSH", label: "Notifications push" },
  { valeur: "EMAIL", label: "E-mail" },
  { valeur: "SMS", label: "SMS" },
  { valeur: "WHATSAPP", label: "WhatsApp" },
];

const FREQUENCES = [
  { valeur: "IMMEDIATE", label: "Immédiate" },
  { valeur: "DAILY", label: "Résumé quotidien" },
  { valeur: "WEEKLY", label: "Résumé hebdomadaire" },
];

export default function ParametresNotificationsPage() {
  const [canal, setCanal] = useState("PUSH");
  const [frequence, setFrequence] = useState("DAILY");
  const [chargement, setChargement] = useState(true);
  const [enregistrement, setEnregistrement] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/api/parent/notification-settings")
      .then(({ data }) => {
        if (data?.canal) setCanal(data.canal);
        if (data?.frequence) setFrequence(data.frequence);
      })
      .catch(() => {})
      .finally(() => setChargement(false));
  }, []);

  const enregistrer = async () => {
    setEnregistrement(true);
    setMessage(null);
    try {
      await api.put("/api/parent/notification-settings", { canal, frequence });
      setMessage("Préférences enregistrées.");
    } catch {
      setMessage("Impossible d'enregistrer. Réessayez.");
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

      <h1 className="mt-4 text-2xl font-bold text-neutral-900">Notifications</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Choisissez comment et à quelle fréquence être informé de la progression
        de votre enfant.
      </p>

      {chargement ? (
        <p className="mt-8 text-sm text-neutral-500">Chargement…</p>
      ) : (
        <div className="mt-8 space-y-6">
          <section className="rounded-2xl border border-neutral-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-neutral-900">Canal préféré</h2>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {CANAUX.map((c) => (
                <button
                  key={c.valeur}
                  onClick={() => setCanal(c.valeur)}
                  className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                    canal === c.valeur
                      ? "border-teal-700 bg-teal-50 text-teal-800"
                      : "border-neutral-200 text-neutral-700 hover:border-teal-300"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-neutral-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-neutral-900">Fréquence</h2>
            <div className="mt-3 flex flex-col gap-2">
              {FREQUENCES.map((f) => (
                <button
                  key={f.valeur}
                  onClick={() => setFrequence(f.valeur)}
                  className={`rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition ${
                    frequence === f.valeur
                      ? "border-teal-700 bg-teal-50 text-teal-800"
                      : "border-neutral-200 text-neutral-700 hover:border-teal-300"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </section>

          {message && <p className="text-sm text-teal-700">{message}</p>}

          <button
            onClick={enregistrer}
            disabled={enregistrement}
            className="w-full rounded-full bg-teal-700 px-6 py-3 font-semibold text-white transition hover:bg-teal-800 disabled:opacity-60"
          >
            {enregistrement ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      )}
    </div>
  );
}
