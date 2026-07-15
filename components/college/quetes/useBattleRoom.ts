"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Socket } from "socket.io-client";
import { connecterBattleSocket } from "@/lib/realtime/battleSocket";
import { BattleVoiceMesh, type EtatVoixPair } from "@/lib/realtime/webrtc";
import { sauvegarderSiege } from "@/lib/college/quetes/battle-guest";
import { SECONDES_PAR_QUESTION } from "@/lib/college/quetes/battle";

export type BattleParticipantVue = {
  id: string;
  nom: string;
  hote: boolean;
  pret: boolean;
  questionIndex: number;
  estInvite: boolean;
};

export type BattleMessage = { participantId: string; nom: string; texte: string; ts: number };
export type Question = { question: string; choix: string[]; bonneReponseIndex: number };
export type PhaseBattle = "connexion" | "lobby" | "jeu" | "syncro" | "resultat";
export type ClassementLigne = { nom: string; score: number; tempsMs: number; moi: boolean; fantome: boolean };

export type SessionInfo = {
  id: string;
  code: string | null;
  type: "DUEL" | "BATTLE_ROYALE";
  status: "EN_ATTENTE" | "EN_COURS" | "TERMINEE";
  metierSlug: string;
};

type Ack = { ok: boolean; error?: string };

type Params = {
  session: SessionInfo;
  participantId: string;
  guestToken: string;
  nomMoi: string;
  questionsInitiales?: Question[];
};

/**
 * État et actions d'un salon Battle en direct : connexion au socket temps
 * réel (backend Express, namespace /battle), présence des participants,
 * chat, voix (maillage WebRTC), progression live pendant la partie, et
 * déroulé question/score/résultat.
 */
export function useBattleRoom({ session, participantId, guestToken, nomMoi, questionsInitiales }: Params) {
  const [phase, setPhase] = useState<PhaseBattle>(
    session.status === "TERMINEE" ? "resultat" : session.status === "EN_COURS" ? "jeu" : "connexion"
  );
  const [connecte, setConnecte] = useState(false);
  const [participants, setParticipants] = useState<BattleParticipantVue[]>([]);
  const [progression, setProgression] = useState<Record<string, number>>({});
  const [messages, setMessages] = useState<BattleMessage[]>([]);
  const [micActif, setMicActif] = useState(false);
  const [micsCoupes, setMicsCoupes] = useState<Record<string, boolean>>({});
  const [etatsVoix, setEtatsVoix] = useState<Record<string, EtatVoixPair>>({});
  const [erreur, setErreur] = useState<string | null>(null);

  const [questions, setQuestions] = useState<Question[]>(questionsInitiales ?? []);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [chrono, setChrono] = useState(SECONDES_PAR_QUESTION);
  const [classement, setClassement] = useState<ClassementLigne[] | null>(null);
  const [xpGagne, setXpGagne] = useState(0);

  const debutJeuRef = useRef(session.status === "EN_COURS" ? Date.now() : 0);
  const socketRef = useRef<Socket | null>(null);
  const meshRef = useRef<BattleVoiceMesh | null>(null);
  const peerSocketsRef = useRef(new Map<string, string>());
  const audioElsRef = useRef(new Map<string, HTMLAudioElement>());

  useEffect(() => {
    sauvegarderSiege({ sessionId: session.id, participantId, guestToken, nom: nomMoi });
  }, [session.id, participantId, guestToken, nomMoi]);

  useEffect(() => {
    const socket = connecterBattleSocket(participantId, guestToken);
    socketRef.current = socket;

    const mesh = new BattleVoiceMesh(socket, {
      onRemoteStream: (socketId, stream) => {
        let audio = audioElsRef.current.get(socketId);
        if (!audio) {
          audio = new Audio();
          audio.autoplay = true;
          audioElsRef.current.set(socketId, audio);
        }
        audio.srcObject = stream;
      },
      onEtatPair: (socketId, etat) => {
        setEtatsVoix((prev) => ({ ...prev, [socketId]: etat }));
      },
    });
    meshRef.current = mesh;

    socket.on("connect", () => setConnecte(true));
    socket.on("disconnect", () => setConnecte(false));
    socket.on("connect_error", () => setErreur("Connexion au salon impossible pour le moment."));

    socket.on("room_update", (data: { participants: BattleParticipantVue[] }) => {
      setParticipants(data.participants);
      setPhase((p) => (p === "connexion" ? "lobby" : p));
    });

    socket.on("peers", (peers: { socketId: string; participantId: string }[]) => {
      peers.forEach((p) => peerSocketsRef.current.set(p.socketId, p.participantId));
      if (mesh.microphoneActif) {
        peers.forEach((p) => void mesh.initierAppel(p.socketId));
      }
    });

    socket.on("peer_joined", (p: { socketId: string; participantId: string }) => {
      peerSocketsRef.current.set(p.socketId, p.participantId);
    });

    socket.on("peer_left", (p: { participantId: string }) => {
      for (const [socketId, pid] of peerSocketsRef.current.entries()) {
        if (pid === p.participantId) {
          mesh.retirerPair(socketId);
          peerSocketsRef.current.delete(socketId);
          audioElsRef.current.delete(socketId);
        }
      }
    });

    socket.on("webrtc_signal", (payload: Parameters<BattleVoiceMesh["gererSignal"]>[0]) => {
      void mesh.gererSignal(payload);
    });

    socket.on("mic_state", (p: { participantId: string; muted: boolean }) => {
      setMicsCoupes((prev) => ({ ...prev, [p.participantId]: p.muted }));
    });

    socket.on("game_started", (data: { questions: Question[] }) => {
      setQuestions(data.questions);
      setIndex(0);
      setScore(0);
      setChrono(SECONDES_PAR_QUESTION);
      setProgression({});
      debutJeuRef.current = Date.now();
      setPhase("jeu");
    });

    socket.on("peer_progress", (p: { participantId: string; questionIndex: number }) => {
      setProgression((prev) => ({ ...prev, [p.participantId]: p.questionIndex }));
    });

    socket.on("chat_message", (m: BattleMessage) => {
      setMessages((prev) => [...prev, m].slice(-100));
    });

    return () => {
      socket.disconnect();
      mesh.fermerTout();
      audioElsRef.current.forEach((audio) => {
        audio.srcObject = null;
      });
      audioElsRef.current.clear();
    };
    // session.id et nomMoi ne changent pas pendant la vie d'un salon.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [participantId, guestToken]);

  const basculerPret = useCallback(() => {
    socketRef.current?.emit("toggle_ready", {}, (res: Ack) => {
      if (!res.ok && res.error) setErreur(res.error);
    });
  }, []);

  const lancerPartie = useCallback(() => {
    socketRef.current?.emit("start_game", {}, (res: Ack) => {
      if (!res.ok && res.error) setErreur(res.error);
    });
  }, []);

  const envoyerMessage = useCallback((texte: string) => {
    if (!texte.trim()) return;
    socketRef.current?.emit("chat_message", { texte }, (res: Ack) => {
      if (!res.ok && res.error) setErreur(res.error);
    });
  }, []);

  const activerMicro = useCallback(async () => {
    try {
      await meshRef.current?.activerMicrophone();
      setMicActif(true);
      for (const socketId of peerSocketsRef.current.keys()) {
        void meshRef.current?.initierAppel(socketId);
      }
    } catch {
      setErreur("Impossible d'accéder au micro (permission refusée ?).");
    }
  }, []);

  const couperMicro = useCallback((coupe: boolean) => {
    meshRef.current?.definirMicCoupe(coupe);
    setMicActif(!coupe);
  }, []);

  const terminerPartie = useCallback(
    async (scoreFinal: number) => {
      setPhase("syncro");
      const envoyer = () =>
        fetch("/api/college/quetes/battle/terminer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: session.id,
            participantId,
            guestToken,
            score: scoreFinal,
            tempsMs: Date.now() - debutJeuRef.current,
          }),
        }).then((r) => r.json());

      let data = await envoyer();
      while (data.status !== "TERMINEE") {
        await new Promise((r) => setTimeout(r, 3000));
        data = await envoyer();
      }
      setClassement(data.classement);
      setXpGagne(data.xpGagne);
      setPhase("resultat");
    },
    [session.id, participantId, guestToken]
  );

  const repondre = useCallback(
    (correct: boolean) => {
      const nouveauScore = score + (correct ? 1 : 0);
      setScore(nouveauScore);
      const prochainIndex = index + 1;
      socketRef.current?.emit("answer", { questionIndex: prochainIndex });
      if (prochainIndex >= questions.length) {
        void terminerPartie(nouveauScore);
      } else {
        setIndex(prochainIndex);
        setChrono(SECONDES_PAR_QUESTION);
      }
    },
    [score, index, questions.length, terminerPartie]
  );

  useEffect(() => {
    if (phase !== "jeu") return;
    if (chrono <= 0) {
      repondre(false);
      return;
    }
    const t = setTimeout(() => setChrono((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, chrono, repondre]);

  const moi = participants.find((p) => p.id === participantId) ?? null;

  return {
    phase,
    connecte,
    erreur,
    setErreur,
    participants,
    progression,
    messages,
    micActif,
    micsCoupes,
    etatsVoix,
    questions,
    index,
    score,
    chrono,
    classement,
    xpGagne,
    moi,
    actions: { basculerPret, lancerPartie, envoyerMessage, activerMicro, couperMicro, repondre },
  };
}
