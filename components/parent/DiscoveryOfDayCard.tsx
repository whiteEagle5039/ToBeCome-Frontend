"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Lightbulb } from "lucide-react";
import { Card } from "@/components/parent/ui";

interface DiscoveryOfDay {
  metierNom: string;
  metierSlug: string;
  saviezVous: string;
  prenom: string;
  nom: string;
  photoUrl?: string;
}

/**
 * Appelle un endpoint public /api/decouverte-jour qui n'existe pas
 * encore côté backend — le modèle Prisma DecouverteJour existe déjà
 * dans votre schéma, il ne manque qu'une petite route qui renvoie
 * l'entrée du jour (dateAffiche = aujourd'hui) avec le métier lié.
 * Tant que la route n'existe pas, la carte reste simplement masquée
 * (échec silencieux) plutôt que de casser le dashboard.
 */
async function fetchDiscoveryOfDay(): Promise<DiscoveryOfDay | null> {
  try {
    const res = await fetch("/api/decouverte-jour");
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.metier) return null;
    return {
      metierNom: data.metier.nom,
      metierSlug: data.metier.slug,
      saviezVous: data.saviez_vous,
      prenom: data.prenom,
      nom: data.nom,
      photoUrl: data.photoUrl ?? undefined,
    };
  } catch {
    return null;
  }
}

export function DiscoveryOfDayCard() {
  const [discovery, setDiscovery] = useState<DiscoveryOfDay | null | undefined>(undefined);

  useEffect(() => {
    let active = true;
    fetchDiscoveryOfDay().then((d) => {
      if (active) setDiscovery(d);
    });
    return () => {
      active = false;
    };
  }, []);

  // undefined = pas encore chargé, null = pas de donnée / endpoint absent
  if (!discovery) return null;

  return (
    <Card className="mt-4 flex items-center gap-4 p-5">
      {discovery.photoUrl ? (
        <img
          src={discovery.photoUrl}
          alt=""
          className="h-14 w-14 shrink-0 rounded-2xl object-cover"
        />
      ) : (
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
          <Lightbulb size={22} />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate">Découverte du jour</p>
        <p className="mt-0.5 font-display font-semibold text-teal-950">{discovery.metierNom}</p>
        <p className="mt-0.5 line-clamp-2 text-sm text-slate">{discovery.saviezVous}</p>
      </div>
      <Link
        href={`/parent/metiers/${discovery.metierSlug}`}
        className="focus-ring shrink-0 whitespace-nowrap text-sm font-semibold text-teal-700 hover:underline"
      >
        Découvrir
      </Link>
    </Card>
  );
}