/**
 * Point d'entrée serveur pour l'authentification de l'espace collège.
 * Les routes API et pages serveur importent `getCurrentUser` / `getCurrentEleve`
 * depuis "@/lib/auth" — la session est basée sur le cookie `tbc_session`.
 */
export { getCurrentUser, getCurrentEleve, creerSession, detruireSession } from "@/lib/college/auth/session";
