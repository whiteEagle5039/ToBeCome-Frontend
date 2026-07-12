import { cookies } from "next/headers";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "tbc_session";
const SESSION_DUREE_JOURS = 30;

export async function creerSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DUREE_JOURS * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: { userId, token, expiresAt },
  });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });

  return token;
}

export async function detruireSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { token } });
  }
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Retourne l'utilisateur courant (avec son profil élève) à partir du cookie
 * de session, ou null si non authentifié / session expirée.
 *
 * Le paramètre `_req` est accepté (et ignoré) pour compatibilité avec les
 * routes API qui passent la requête : la session est lue via le cookie.
 */
export async function getCurrentUser(_req?: unknown) {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: {
      user: { include: { eleveProfile: true, parentProfile: true, etablissementProfile: true, adminProfile: true } },
    },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) await prisma.session.delete({ where: { id: session.id } });
    return null;
  }

  return session.user;
}

/**
 * Raccourci pour les pages/API qui n'ont besoin que du profil élève courant.
 */
export async function getCurrentEleve(_req?: unknown) {
  const user = await getCurrentUser();
  return user?.eleveProfile ?? null;
}
