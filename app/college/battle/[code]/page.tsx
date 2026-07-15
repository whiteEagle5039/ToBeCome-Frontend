"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BattleRoom } from "@/components/college/quetes/BattleRoom";
import { chargerSiege, genererPseudoAleatoire } from "@/lib/college/quetes/battle-guest";
import type { SessionInfo, Question } from "@/components/college/quetes/useBattleRoom";

type Etat =
  | { statut: "chargement" }
  | { statut: "pseudo"; session: SessionInfo }
  | { statut: "erreur"; message: string }
  | {
      statut: "pret";
      session: SessionInfo;
      participantId: string;
      guestToken: string;
      nomMoi: string;
      questions?: Question[];
    };

/**
 * Point d'entrée public d'un lien d'invitation Battle : accessible sans
 * compte. Un élève déjà connecté rejoint silencieusement ; sinon, un pseudo
 * (pré-rempli au hasard, modifiable) suffit à rejoindre en invité. Un siège
 * déjà enregistré en localStorage (rafraîchissement de page) est repris tel
 * quel plutôt que de créer un doublon.
 */
export default function RejoindreBattlePage() {
  const params = useParams<{ code: string }>();
  const [etat, setEtat] = useState<Etat>({ statut: "chargement" });
  const [pseudo, setPseudo] = useState(() => genererPseudoAleatoire());
  const [envoi, setEnvoi] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/college/quetes/battle?code=${encodeURIComponent(params.code)}`);
      const data = await res.json();
      if (!res.ok) {
        setEtat({ statut: "erreur", message: data.error ?? "Salon introuvable." });
        return;
      }

      const session = data.session;
      const questions: Question[] | undefined = data.questions;

      const siege = chargerSiege(session.id);
      const dejaMembre = siege && session.participants?.some((p: { id: string }) => p.id === siege.participantId);
      if (siege && dejaMembre) {
        setEtat({
          statut: "pret",
          session,
          participantId: siege.participantId,
          guestToken: siege.guestToken,
          nomMoi: siege.nom,
          questions,
        });
        return;
      }

      // Élève déjà connecté : adhésion silencieuse, sans pseudo à saisir.
      const resJoin = await fetch("/api/college/quetes/battle", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: params.code }),
      });
      const dataJoin = await resJoin.json();
      if (resJoin.ok) {
        const moi = dataJoin.session.participants.find((p: { id: string }) => p.id === dataJoin.participantId);
        setEtat({
          statut: "pret",
          session: dataJoin.session,
          participantId: dataJoin.participantId,
          guestToken: dataJoin.guestToken,
          nomMoi: moi?.nom ?? "Toi",
          questions,
        });
        return;
      }

      if (resJoin.status === 400) {
        setEtat({ statut: "pseudo", session });
        return;
      }

      setEtat({ statut: "erreur", message: dataJoin.error ?? "Impossible de rejoindre ce salon." });
    })();
  }, [params.code]);

  const rejoindreEnInvite = async () => {
    if (etat.statut !== "pseudo" || !pseudo.trim()) return;
    setEnvoi(true);
    const res = await fetch("/api/college/quetes/battle", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: params.code, guestNom: pseudo.trim() }),
    });
    const data = await res.json();
    setEnvoi(false);
    if (!res.ok) {
      setEtat({ statut: "erreur", message: data.error ?? "Impossible de rejoindre ce salon." });
      return;
    }
    const moi = data.session.participants.find((p: { id: string }) => p.id === data.participantId);
    setEtat({
      statut: "pret",
      session: data.session,
      participantId: data.participantId,
      guestToken: data.guestToken,
      nomMoi: moi?.nom ?? pseudo.trim(),
    });
  };

  if (etat.statut === "chargement") {
    return (
      <main className="mx-auto max-w-xl px-6 py-10 text-center">
        <p className="text-lg font-semibold text-espace-ink">Recherche du salon…</p>
      </main>
    );
  }

  if (etat.statut === "erreur") {
    return (
      <main className="mx-auto max-w-xl px-6 py-10 text-center">
        <p className="text-lg font-semibold text-espace-ink">{etat.message}</p>
      </main>
    );
  }

  if (etat.statut === "pseudo") {
    return (
      <main className="mx-auto max-w-xl px-6 py-10">
        <p className="text-xs uppercase tracking-wide text-espace-muted">
          {etat.session.type === "DUEL" ? "Duel 1 vs 1" : "Battle Royale"}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-espace-ink">Rejoindre en invité</h1>
        <p className="mt-2 text-sm text-espace-muted">
          Choisis un pseudo pour rejoindre la partie — pas besoin de compte.
        </p>

        <div className="mt-5 flex flex-col gap-3">
          <input
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            maxLength={40}
            className="rounded-lg border border-espace-border px-4 py-3 text-espace-ink"
          />
          <button
            onClick={rejoindreEnInvite}
            disabled={envoi || !pseudo.trim()}
            className="rounded-lg bg-espace-primary px-5 py-3 font-medium text-white transition hover:bg-espace-primaryDark disabled:opacity-50"
          >
            {envoi ? "Connexion…" : "Rejoindre la partie"}
          </button>
        </div>
      </main>
    );
  }

  return (
    <BattleRoom
      session={etat.session}
      participantId={etat.participantId}
      guestToken={etat.guestToken}
      nomMoi={etat.nomMoi}
      questionsInitiales={etat.questions}
    />
  );
}
