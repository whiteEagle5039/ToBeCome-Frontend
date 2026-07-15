"use client";

import { useState } from "react";
import Link from "next/link";
import { Mic, MicOff, Copy, Check } from "lucide-react";
import { capaciteMax } from "@/lib/college/quetes/battle-shared";
import { InviterCommunaute } from "@/components/college/quetes/InviterCommunaute";
import { useBattleRoom, type Question, type SessionInfo } from "./useBattleRoom";

const SECONDES_PAR_QUESTION = 15;

type BattleRoomProps = {
  session: SessionInfo;
  participantId: string;
  guestToken: string;
  nomMoi: string;
  questionsInitiales?: Question[];
  /** Lien de retour affiché sur l'écran de résultat (facultatif : un invité n'a pas de hub à retrouver). */
  retourHref?: string;
};

export function BattleRoom({
  session,
  participantId,
  guestToken,
  nomMoi,
  questionsInitiales,
  retourHref,
}: BattleRoomProps) {
  const {
    phase,
    connecte,
    erreur,
    setErreur,
    participants,
    progression,
    messages,
    micActif,
    micsCoupes,
    questions,
    index,
    score,
    chrono,
    classement,
    xpGagne,
    moi,
    actions,
  } = useBattleRoom({ session, participantId, guestToken, nomMoi, questionsInitiales });

  const [messageTexte, setMessageTexte] = useState("");
  const [lienCopie, setLienCopie] = useState(false);

  const lienInvitation =
    session.code && typeof window !== "undefined" ? `${window.location.origin}/college/battle/${session.code}` : null;

  const copierLien = async () => {
    if (!lienInvitation) return;
    try {
      await navigator.clipboard.writeText(lienInvitation);
      setLienCopie(true);
      setTimeout(() => setLienCopie(false), 2000);
    } catch {
      // presse-papiers indisponible — le code brut reste visible à l'écran
    }
  };

  const envoyer = () => {
    if (!messageTexte.trim()) return;
    actions.envoyerMessage(messageTexte);
    setMessageTexte("");
  };

  // ── Connexion (y compris réveil à froid du backend Render en plan gratuit) ─
  if (phase === "connexion") {
    return (
      <main className="mx-auto max-w-xl px-6 py-10 text-center">
        <p className="text-lg font-semibold text-espace-ink">Connexion à la partie…</p>
        <p className="mt-2 text-sm text-espace-muted">
          {connecte ? "Presque prêt." : "Ça peut prendre jusqu'à 30 secondes la première fois."}
        </p>
        {erreur && <p className="mt-4 text-sm text-red-600">{erreur}</p>}
      </main>
    );
  }

  // ── Lobby : participants, prêt/hôte, invitation, chat, micro ───────────────
  if (phase === "lobby") {
    const capacite = capaciteMax(session.type);
    return (
      <main className="mx-auto max-w-xl px-6 py-10">
        <p className="text-xs uppercase tracking-wide text-espace-muted">
          {session.type === "DUEL" ? "Duel 1 vs 1" : "Battle Royale"}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-espace-ink">Salon d'attente</h1>

        {erreur && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erreur}</p>
        )}

        <div className="mt-5 flex flex-col gap-2">
          {participants.map((p) => (
            <div
              key={p.id}
              className={`flex items-center justify-between rounded-lg border px-4 py-3 ${
                p.id === participantId ? "border-espace-primary bg-espace-surface" : "border-espace-border bg-white"
              }`}
            >
              <span className="flex items-center gap-2 text-espace-ink">
                {p.nom} {p.id === participantId && "(toi)"}
                {p.hote && (
                  <span className="rounded-full bg-espace-primary/10 px-2 py-0.5 text-xs font-medium text-espace-primary">
                    Hôte
                  </span>
                )}
                {p.estInvite && (
                  <span className="rounded-full bg-espace-border px-2 py-0.5 text-xs text-espace-muted">Invité</span>
                )}
                {micsCoupes[p.id] === false && <Mic className="h-3.5 w-3.5 text-espace-primary" />}
              </span>
              <span
                className={`text-xs font-medium ${p.pret ? "text-green-600" : "text-espace-muted"}`}
              >
                {p.pret ? "Prêt" : "En attente"}
              </span>
            </div>
          ))}
          <p className="text-center text-xs text-espace-muted">
            {participants.length} / {capacite} joueur(s)
          </p>
        </div>

        <div className="mt-5 rounded-xl border border-espace-border bg-white p-4">
          <p className="text-sm font-semibold text-espace-ink">Inviter d'autres joueurs</p>
          <p className="mt-1 text-xs text-espace-muted">
            N'importe qui avec ce lien peut rejoindre en invité, sans compte.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <code className="flex-1 truncate rounded-lg border border-espace-border bg-espace-surface px-3 py-2 text-xs text-espace-ink">
              {lienInvitation ?? session.code}
            </code>
            <button
              onClick={copierLien}
              className="flex items-center gap-1 rounded-lg bg-espace-primary px-3 py-2 text-xs font-medium text-white transition hover:bg-espace-primaryDark"
            >
              {lienCopie ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {lienCopie ? "Copié" : "Copier"}
            </button>
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <button
            onClick={actions.basculerPret}
            className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition ${
              moi?.pret
                ? "border-green-600 bg-green-50 text-green-700"
                : "border-espace-border bg-white text-espace-ink hover:border-espace-primary"
            }`}
          >
            {moi?.pret ? "Je suis prêt ✓" : "Je suis prêt"}
          </button>
          <button
            onClick={() => (micActif ? actions.couperMicro(true) : actions.activerMicro())}
            className="flex items-center gap-2 rounded-lg border border-espace-border bg-white px-4 py-3 text-sm font-medium text-espace-ink transition hover:border-espace-primary"
          >
            {micActif ? <Mic className="h-4 w-4 text-espace-primary" /> : <MicOff className="h-4 w-4" />}
            {micActif ? "Micro actif" : "Activer le micro"}
          </button>
        </div>

        {moi?.hote && (
          <button
            onClick={actions.lancerPartie}
            className="mt-3 w-full rounded-lg bg-espace-primary px-5 py-3 font-medium text-white transition hover:bg-espace-primaryDark"
          >
            Lancer la partie
          </button>
        )}

        <ChatPanel
          messages={messages}
          moi={participantId}
          texte={messageTexte}
          onChangeTexte={(v) => {
            setErreur(null);
            setMessageTexte(v);
          }}
          onEnvoyer={envoyer}
        />

        {moi && !moi.estInvite && lienInvitation && (
          <InviterCommunaute
            message={`Rejoins ma Battle (${session.type === "DUEL" ? "Duel 1 vs 1" : "Battle Royale"}) : ${lienInvitation}`}
          />
        )}
      </main>
    );
  }

  // ── Jeu : question, timer, score + progression live des adversaires ───────
  if (phase === "jeu" && questions[index]) {
    const q = questions[index];
    return (
      <main className="mx-auto max-w-xl px-6 py-10">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-wide text-espace-muted">
            Battle — question {index + 1} / {questions.length}
          </p>
          <span
            className={`rounded-full px-3 py-1 text-sm font-bold ${
              chrono <= 5 ? "bg-red-100 text-red-700" : "bg-espace-surface text-espace-primary"
            }`}
          >
            {chrono}s
          </span>
        </div>

        <div className="mt-3 h-1.5 w-full rounded-full bg-espace-border">
          <div
            className="h-full rounded-full bg-espace-accent transition-all duration-1000 ease-linear"
            style={{ width: `${(chrono / SECONDES_PAR_QUESTION) * 100}%` }}
          />
        </div>

        {participants.length > 1 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {participants
              .filter((p) => p.id !== participantId)
              .map((p) => {
                const idx = progression[p.id] ?? 0;
                return (
                  <div key={p.id} className="flex-1 min-w-[8rem] rounded-lg border border-espace-border bg-white px-3 py-2">
                    <p className="truncate text-xs font-medium text-espace-ink">{p.nom}</p>
                    <div className="mt-1 h-1 w-full rounded-full bg-espace-border">
                      <div
                        className="h-full rounded-full bg-espace-primary transition-all"
                        style={{ width: `${(idx / questions.length) * 100}%` }}
                      />
                    </div>
                    <p className="mt-0.5 text-[10px] text-espace-muted">
                      {idx} / {questions.length}
                    </p>
                  </div>
                );
              })}
          </div>
        )}

        <p className="mt-6 text-lg font-semibold text-espace-ink">{q.question}</p>
        <div className="mt-4 flex flex-col gap-2">
          {q.choix.map((choix, i) => (
            <button
              key={i}
              onClick={() => actions.repondre(i === q.bonneReponseIndex)}
              className="rounded-lg border border-espace-border bg-white px-4 py-3 text-left text-espace-ink transition hover:border-espace-primary hover:bg-espace-surface"
            >
              {choix}
            </button>
          ))}
        </div>
        <p className="mt-4 text-sm text-espace-muted">Ton score : {score}</p>
      </main>
    );
  }

  // ── Synchronisation : en attente que les autres terminent ─────────────────
  if (phase === "syncro") {
    return (
      <main className="mx-auto max-w-xl px-6 py-10 text-center">
        <p className="text-lg font-semibold text-espace-ink">Tu as terminé !</p>
        <p className="mt-2 text-espace-muted">En attente que les autres joueurs finissent…</p>
      </main>
    );
  }

  // ── Résultat ────────────────────────────────────────────────────────────
  if (phase === "resultat") {
    if (!classement) {
      return (
        <main className="mx-auto max-w-xl px-6 py-10 text-center">
          <p className="text-lg font-semibold text-espace-ink">Cette partie est terminée.</p>
          {retourHref && (
            <Link href={retourHref} className="mt-4 inline-block font-medium text-espace-primary hover:underline">
              Retour
            </Link>
          )}
        </main>
      );
    }

    const jaiGagne = classement.findIndex((c) => c.moi) === 0;
    return (
      <main className="mx-auto max-w-xl px-6 py-10">
        <p className="text-xs uppercase tracking-wide text-espace-muted">Résultat de la Battle</p>
        <h1 className="mt-1 text-2xl font-bold text-espace-ink">{jaiGagne ? "Victoire !" : "Bien joué !"}</h1>
        {xpGagne > 0 && <p className="mt-1 font-medium text-espace-primary">+{xpGagne} XP</p>}

        <div className="mt-6 flex flex-col gap-2">
          {classement.map((c, i) => (
            <div
              key={i}
              className={`flex items-center justify-between rounded-lg border px-4 py-3 ${
                c.moi ? "border-espace-primary bg-espace-surface" : "border-espace-border bg-white"
              }`}
            >
              <span className="text-espace-ink">
                <span className="mr-2 font-bold">{i + 1}.</span>
                {c.nom} {c.moi && "(toi)"}
              </span>
              <span className="text-sm text-espace-muted">
                {c.score} pts — {Math.round(c.tempsMs / 1000)}s
              </span>
            </div>
          ))}
        </div>

        {retourHref && (
          <Link
            href={retourHref}
            className="mt-8 inline-block rounded-lg bg-espace-primary px-5 py-3 font-medium text-white transition hover:bg-espace-primaryDark"
          >
            Rejouer
          </Link>
        )}
      </main>
    );
  }

  return null;
}

function ChatPanel({
  messages,
  moi,
  texte,
  onChangeTexte,
  onEnvoyer,
}: {
  messages: { participantId: string; nom: string; texte: string; ts: number }[];
  moi: string;
  texte: string;
  onChangeTexte: (v: string) => void;
  onEnvoyer: () => void;
}) {
  return (
    <div className="mt-5 rounded-xl border border-espace-border bg-white p-4">
      <p className="text-sm font-semibold text-espace-ink">Discussion</p>
      <div className="mt-3 flex max-h-48 flex-col gap-1.5 overflow-y-auto">
        {messages.length === 0 && <p className="text-xs text-espace-muted">Aucun message pour l'instant.</p>}
        {messages.map((m, i) => (
          <p key={i} className="text-sm">
            <span className={`font-medium ${m.participantId === moi ? "text-espace-primary" : "text-espace-ink"}`}>
              {m.participantId === moi ? "Toi" : m.nom}
            </span>
            <span className="text-espace-muted"> : {m.texte}</span>
          </p>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          value={texte}
          onChange={(e) => onChangeTexte(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onEnvoyer()}
          maxLength={300}
          placeholder="Écris un message…"
          className="flex-1 rounded-lg border border-espace-border px-3 py-2 text-sm text-espace-ink"
        />
        <button
          onClick={onEnvoyer}
          disabled={!texte.trim()}
          className="rounded-lg bg-espace-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-espace-primaryDark disabled:opacity-50"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}
