import Link from "next/link";
import { redirect } from "next/navigation";
import { Sparkles, Award, Unlock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentEleve } from "@/lib/college/auth/session";

/**
 * Interface 1 — Première entrée dans les Quêtes.
 * Si l'élève a déjà son profil RIASEC, il est envoyé directement au hub.
 */
export default async function QuetesEntreePage() {
  const eleve = await getCurrentEleve();
  if (!eleve) redirect("/college/connexion");

  const resultat = await prisma.riasecResultat.findUnique({ where: { eleveId: eleve.id } });
  if (resultat) redirect("/college/quetes/hub");

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-espace-primary">Quêtes</p>
      <h1 className="mt-2 text-3xl font-bold text-espace-ink">Bienvenue dans To Be.Come</h1>
      <p className="mt-4 text-espace-muted">
        Pendant cette aventure, tu découvriras les métiers du numérique. Chaque
        quête te permettra de gagner de l'expérience, de débloquer des badges
        et de construire de vrais projets.
      </p>
      <p className="mt-4 text-espace-muted">
        Mais avant tout... découvrons quel explorateur du numérique tu es.
      </p>

      <div className="mt-8 rounded-xl border border-espace-border bg-espace-surface p-5">
        <p className="mb-3 text-sm font-semibold text-espace-ink">Récompenses</p>
        <ul className="space-y-2 text-sm text-espace-ink">
          <li className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-espace-primary" />
            +500 XP
          </li>
          <li className="flex items-center gap-2">
            <Award className="h-4 w-4 text-espace-primary" />
            Badge Explorateur
          </li>
          <li className="flex items-center gap-2">
            <Unlock className="h-4 w-4 text-espace-primary" />
            Déblocage des campagnes métiers
          </li>
        </ul>
      </div>

      <Link
        href="/college/quetes/riasec"
        className="mt-8 inline-flex items-center justify-center rounded-lg bg-espace-primary px-6 py-3 font-medium text-white transition hover:bg-espace-primaryDark"
      >
        Commencer
      </Link>
    </main>
  );
}
