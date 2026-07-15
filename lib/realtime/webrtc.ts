"use client";

import type { Socket } from "socket.io-client";

const ICE_SERVERS: RTCIceServer[] = [{ urls: "stun:stun.l.google.com:19302" }];
const CONNEXION_TIMEOUT_MS = 6000;

export type EtatVoixPair = "connexion" | "connecte" | "indisponible";

type SignalPayload = {
  from: string;
  participantId: string;
  type: "offer" | "answer" | "ice-candidate";
  data: RTCSessionDescriptionInit | RTCIceCandidateInit;
};

type Callbacks = {
  onRemoteStream: (socketId: string, stream: MediaStream) => void;
  onEtatPair: (socketId: string, etat: EtatVoixPair) => void;
};

/**
 * Maillage WebRTC audio (voix en direct) entre les participants d'un salon
 * Battle — au maximum 5 joueurs en Battle Royale, donc 10 connexions pair-à-
 * pair au total : largement dans les limites d'un maillage complet, pas
 * besoin de SFU. Signalisation relayée par le socket "battle" du serveur.
 * STUN public uniquement (pas de TURN en v1) : sur un réseau très restrictif,
 * la connexion voix peut échouer — voir onEtatPair("indisponible").
 */
export class BattleVoiceMesh {
  private localStream: MediaStream | null = null;
  private pairs = new Map<string, RTCPeerConnection>();
  private timeouts = new Map<string, ReturnType<typeof setTimeout>>();
  private micActif = false;

  constructor(
    private socket: Socket,
    private callbacks: Callbacks
  ) {}

  get microphoneActif() {
    return this.micActif;
  }

  async activerMicrophone(): Promise<MediaStream> {
    if (this.localStream) return this.localStream;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.localStream = stream;
    this.micActif = true;
    for (const pc of this.pairs.values()) {
      stream.getAudioTracks().forEach((track) => pc.addTrack(track, stream));
    }
    return stream;
  }

  definirMicCoupe(coupe: boolean) {
    if (!this.localStream) return;
    this.localStream.getAudioTracks().forEach((t) => (t.enabled = !coupe));
    this.micActif = !coupe;
    this.socket.emit("mic_state", { muted: coupe });
  }

  /** Appelé par le nouvel arrivant vers chaque pair déjà présent dans le salon. */
  async initierAppel(socketId: string) {
    const pc = this.pairs.get(socketId) ?? this.creerConnexion(socketId);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    this.socket.emit("webrtc_signal", { to: socketId, type: "offer", data: offer });
  }

  async gererSignal(payload: SignalPayload) {
    const pc = this.pairs.get(payload.from) ?? this.creerConnexion(payload.from);

    if (payload.type === "offer") {
      await pc.setRemoteDescription(new RTCSessionDescription(payload.data as RTCSessionDescriptionInit));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      this.socket.emit("webrtc_signal", { to: payload.from, type: "answer", data: answer });
    } else if (payload.type === "answer") {
      await pc.setRemoteDescription(new RTCSessionDescription(payload.data as RTCSessionDescriptionInit));
    } else {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(payload.data as RTCIceCandidateInit));
      } catch {
        // candidat arrivé avant la description distante — sans conséquence
      }
    }
  }

  retirerPair(socketId: string) {
    this.pairs.get(socketId)?.close();
    this.pairs.delete(socketId);
    const timeout = this.timeouts.get(socketId);
    if (timeout) {
      clearTimeout(timeout);
      this.timeouts.delete(socketId);
    }
  }

  fermerTout() {
    for (const socketId of Array.from(this.pairs.keys())) this.retirerPair(socketId);
    this.localStream?.getTracks().forEach((t) => t.stop());
    this.localStream = null;
    this.micActif = false;
  }

  private creerConnexion(socketId: string): RTCPeerConnection {
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

    if (this.localStream) {
      this.localStream.getAudioTracks().forEach((track) => pc.addTrack(track, this.localStream!));
    }

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit("webrtc_signal", { to: socketId, type: "ice-candidate", data: event.candidate });
      }
    };

    pc.ontrack = (event) => {
      const timeout = this.timeouts.get(socketId);
      if (timeout) {
        clearTimeout(timeout);
        this.timeouts.delete(socketId);
      }
      this.callbacks.onEtatPair(socketId, "connecte");
      this.callbacks.onRemoteStream(socketId, event.streams[0]);
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "failed" || pc.connectionState === "closed") {
        this.callbacks.onEtatPair(socketId, "indisponible");
      }
    };

    const timeout = setTimeout(() => {
      if (pc.connectionState !== "connected") this.callbacks.onEtatPair(socketId, "indisponible");
    }, CONNEXION_TIMEOUT_MS);
    this.timeouts.set(socketId, timeout);

    this.pairs.set(socketId, pc);
    this.callbacks.onEtatPair(socketId, "connexion");
    return pc;
  }
}
