import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentEleve } from "@/lib/college/auth/session";
import { CommunauteHeader } from "@/components/college/communautes/CommunauteHeader";
import { CommunauteTabs } from "@/components/college/communautes/CommunauteTabs";
import { BackButton } from "@/components/college/BackButton";

export default async function CommunauteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const eleve = await getCurrentEleve();

  const communaute = await prisma.communaute.findUnique({ where: { slug: (await params).slug } });
  if (!communaute) notFound();

  const [nbMembres, membre] = await Promise.all([
    prisma.communauteMembre.count({ where: { communauteId: communaute.id } }),
    eleve
      ? prisma.communauteMembre.findUnique({
          where: { communauteId_eleveId: { communauteId: communaute.id, eleveId: eleve.id } },
        })
      : null,
  ]);

  return (
    <main className="mx-auto max-w-2xl">
      <div className="px-6 pt-4">
        <BackButton href="/college/communautes" label="Communautés" />
      </div>
      <CommunauteHeader
        slug={communaute.slug}
        nom={communaute.nom}
        description={communaute.description}
        nbMembres={nbMembres}
        estMembre={!!membre}
        estPrivee={communaute.estPrivee}
      />
      <CommunauteTabs slug={communaute.slug} />
      <div className="px-6 py-6">{children}</div>
    </main>
  );
}
