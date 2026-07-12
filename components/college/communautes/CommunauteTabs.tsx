"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ONGLETS = [
  { href: "", label: "Accueil" },
  { href: "/discussions", label: "Discussions" },
  { href: "/annonces", label: "Annonces" },
  { href: "/evenements", label: "Événements" },
  { href: "/classement", label: "Classement" },
  { href: "/defis", label: "Défis" },
  { href: "/ressources", label: "Ressources" },
  { href: "/galerie", label: "Galerie" },
  { href: "/membres", label: "Membres" },
];

export function CommunauteTabs({ slug }: { slug: string }) {
  const pathname = usePathname();
  const base = `/college/communautes/${slug}`;

  return (
    <nav className="scrollbar-none -mx-6 flex gap-1 overflow-x-auto border-b border-espace-border px-6">
      {ONGLETS.map((onglet) => {
        const href = `${base}${onglet.href}`;
        const actif = pathname === href;
        return (
          <Link
            key={onglet.href}
            href={href}
            className={`shrink-0 border-b-2 px-3 py-3 text-sm font-medium transition ${
              actif
                ? "border-espace-primary text-espace-primary"
                : "border-transparent text-espace-muted hover:text-espace-ink"
            }`}
          >
            {onglet.label}
          </Link>
        );
      })}
    </nav>
  );
}
