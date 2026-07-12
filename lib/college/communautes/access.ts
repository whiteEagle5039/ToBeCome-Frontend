import { prisma } from "@/lib/prisma";

export async function getCommunauteEtAppartenance(slug: string, eleveId?: string | null) {
  const communaute = await prisma.communaute.findUnique({ where: { slug } });
  if (!communaute) return { communaute: null, membre: null };

  const membre = eleveId
    ? await prisma.communauteMembre.findUnique({
        where: { communauteId_eleveId: { communauteId: communaute.id, eleveId } },
      })
    : null;

  return { communaute, membre };
}

export function estModerateurOuPlus(role: string | undefined | null): boolean {
  return role === "MODERATEUR" || role === "ADMIN";
}
