"use client";

import { Crown, Mic, MicOff } from "lucide-react";

type Taille = "md" | "lg";

type ParticipantAvatarProps = {
  nom: string;
  /** Le participant affiché est l'utilisateur courant. */
  moi?: boolean;
  hote?: boolean;
  invite?: boolean;
  /** true = micro coupé ou jamais activé (état par défaut), false = micro actif. */
  micCoupe?: boolean;
  enParle?: boolean;
  /** Anneau de progression façon story (0 à 1) — utilisé pendant la partie. */
  progression?: number;
  /** Anneau plein (prêt) ou pointillé (en attente) — utilisé dans le salon d'attente, ignoré si `progression` est fourni. */
  pret?: boolean;
  taille?: Taille;
};

const CONFIG_TAILLE: Record<Taille, { boite: number; epaisseur: number; rayon: number; avatar: number; police: number }> = {
  md: { boite: 64, epaisseur: 3, rayon: 29, avatar: 52, police: 18 },
  lg: { boite: 80, epaisseur: 3.5, rayon: 36, avatar: 66, police: 22 },
};

function initiale(nom: string) {
  return nom.trim().slice(0, 1).toUpperCase() || "?";
}

/**
 * Avatar rond d'un participant de salon Battle — façon Discord/Meet : anneau
 * de progression autour (style story), pastille micro en bas à droite, halo
 * animé quand la voix est détectée sur son flux.
 */
export function ParticipantAvatar({
  nom,
  moi = false,
  hote = false,
  invite = false,
  micCoupe = true,
  enParle = false,
  progression,
  pret = false,
  taille = "md",
}: ParticipantAvatarProps) {
  const { boite, epaisseur, rayon, avatar, police } = CONFIG_TAILLE[taille];
  const circonference = 2 * Math.PI * rayon;
  const enAttente = progression === undefined && !pret;
  const afficherAnneauPlein = progression !== undefined || pret;
  const ratio = progression !== undefined ? Math.min(1, Math.max(0, progression)) : 1;

  return (
    <div className="flex flex-col items-center gap-1" style={{ width: boite }}>
      <div className="relative" style={{ width: boite, height: boite }}>
        <svg width={boite} height={boite} className="-rotate-90">
          <circle
            cx={boite / 2}
            cy={boite / 2}
            r={rayon}
            fill="none"
            stroke="currentColor"
            strokeWidth={epaisseur}
            strokeLinecap="round"
            strokeDasharray={enAttente ? `${epaisseur} ${epaisseur * 2.2}` : undefined}
            className="text-espace-border"
          />
          {afficherAnneauPlein && (
            <circle
              cx={boite / 2}
              cy={boite / 2}
              r={rayon}
              fill="none"
              stroke="currentColor"
              strokeWidth={epaisseur}
              strokeLinecap="round"
              strokeDasharray={circonference}
              strokeDashoffset={circonference * (1 - ratio)}
              className={progression === undefined ? "text-green-500" : "text-espace-primary"}
              style={{ transition: "stroke-dashoffset 0.4s ease" }}
            />
          )}
        </svg>

        <div
          className={`absolute flex items-center justify-center rounded-full font-semibold text-white ${
            moi ? "bg-espace-primary" : "bg-espace-primary/70"
          } ${enParle ? "animate-anneau-parole" : ""}`}
          style={{
            width: avatar,
            height: avatar,
            left: (boite - avatar) / 2,
            top: (boite - avatar) / 2,
            fontSize: police,
          }}
        >
          {initiale(nom)}
        </div>

        {hote && (
          <span className="absolute -left-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-espace-accent text-espace-ink shadow">
            <Crown className="h-3 w-3" />
          </span>
        )}

        <span
          className={`absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white shadow ${
            micCoupe ? "bg-espace-muted text-white" : "bg-espace-primary text-white"
          }`}
        >
          {micCoupe ? <MicOff className="h-2.5 w-2.5" /> : <Mic className="h-2.5 w-2.5" />}
        </span>
      </div>

      <p className="max-w-[4.5rem] truncate text-center text-xs font-medium text-espace-ink">{moi ? "Toi" : nom}</p>
      {invite && <p className="text-[10px] text-espace-muted">Invité</p>}
    </div>
  );
}
