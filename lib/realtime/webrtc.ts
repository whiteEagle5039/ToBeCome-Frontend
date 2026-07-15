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
  /** Activité vocale détectée sur le flux d'un pair (façon indicateur "en train de parler" de Discord/Meet). */
  onSpeaking: (socketId: string, parle: boolean) => void;
  /** Activité vocale détectée sur notre propre micro. */
  onLocalSpeaking: (parle: boolean) => void;
};

const SEUIL_VOLUME_PAROLE = 12;
const DELAI_RETOUR_SILENCE_MS = 400;

/** Analyse le volume d'un flux audio et signale les transitions parle/silence (avec un léger délai pour éviter le clignotement entre les mots). */
function demarrerDetectionVoix(contexte: AudioContext, stream: MediaStream, onChange: (parle: boolean) => void): () => void {
  if (stream.getAudioTracks().length === 0) return () => {};

  const source = contexte.createMediaStreamSource(stream);
  const analyseur = contexte.createAnalyser();
  analyseur.fftSize = 512;
  analyseur.smoothingTimeConstant = 0.6;
  source.connect(analyseur);

  const donnees = new Uint8Array(analyseur.frequencyBinCount);
  let enTrainDeParler = false;
  let dernierSonMs = 0;
  let frame = 0;
  let arrete = false;

  const boucle = () => {
    if (arrete) return;
    analyseur.getByteFrequencyData(donnees);
    let somme = 0;
    for (let i = 0; i < donnees.length; i++) somme += donnees[i];
    const moyenne = somme / donnees.length;
    const maintenant = performance.now();

    if (moyenne > SEUIL_VOLUME_PAROLE) {
      dernierSonMs = maintenant;
      if (!enTrainDeParler) {
        enTrainDeParler = true;
        onChange(true);
      }
    } else if (enTrainDeParler && maintenant - dernierSonMs > DELAI_RETOUR_SILENCE_MS) {
      enTrainDeParler = false;
      onChange(false);
    }
    frame = requestAnimationFrame(boucle);
  };
  frame = requestAnimationFrame(boucle);

  return () => {
    arrete = true;
    cancelAnimationFrame(frame);
    source.disconnect();
  };
}

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
  private detectionsVoix = new Map<string, () => void>();
  private arreterDetectionLocale: (() => void) | null = null;
  private contexteAudio: AudioContext | null = null;
  private micActif = false;

  constructor(
    private socket: Socket,
    private callbacks: Callbacks
  ) {}

  get microphoneActif() {
    return this.micActif;
  }

  /** Contexte audio partagé pour l'analyse de volume (voix locale + de chaque pair) — un seul par salon. */
  private obtenirContexteAudio(): AudioContext | null {
    if (this.contexteAudio) return this.contexteAudio;
    const AudioContextCtor =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextCtor) return null;
    this.contexteAudio = new AudioContextCtor();
    return this.contexteAudio;
  }

  async activerMicrophone(): Promise<MediaStream> {
    if (this.localStream) return this.localStream;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.localStream = stream;
    this.micActif = true;
    const contexte = this.obtenirContexteAudio();
    if (contexte) {
      void contexte.resume();
      this.arreterDetectionLocale = demarrerDetectionVoix(contexte, stream, (parle) => this.callbacks.onLocalSpeaking(parle));
    }
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
    this.detectionsVoix.get(socketId)?.();
    this.detectionsVoix.delete(socketId);
  }

  fermerTout() {
    for (const socketId of Array.from(this.pairs.keys())) this.retirerPair(socketId);
    this.arreterDetectionLocale?.();
    this.arreterDetectionLocale = null;
    this.localStream?.getTracks().forEach((t) => t.stop());
    this.localStream = null;
    this.micActif = false;
    void this.contexteAudio?.close().catch(() => {});
    this.contexteAudio = null;
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
      const contexte = this.obtenirContexteAudio();
      if (contexte) {
        void contexte.resume();
        this.detectionsVoix.get(socketId)?.();
        this.detectionsVoix.set(
          socketId,
          demarrerDetectionVoix(contexte, event.streams[0], (parle) => this.callbacks.onSpeaking(socketId, parle))
        );
      }
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
