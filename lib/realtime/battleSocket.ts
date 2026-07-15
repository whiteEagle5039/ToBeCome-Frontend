"use client";

import { io, type Socket } from "socket.io-client";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/$/, "");

/**
 * Connexion Socket.IO au namespace /battle du backend Express. L'identité du
 * siège (participantId + guestToken, attribués à la création/adhésion du
 * salon) authentifie la connexion côté serveur — voir
 * backend/src/realtime/battle.ts.
 */
export function connecterBattleSocket(participantId: string, guestToken: string): Socket {
  return io(`${API_URL}/battle`, {
    auth: { participantId, guestToken },
    transports: ["websocket", "polling"],
  });
}
