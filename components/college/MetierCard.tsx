import Link from "next/link";
import type { Metier } from "@/data/college/metiers";

export default function MetierCard({
  metier,
  href,
}: {
  metier: Metier;
  href: string;
}) {
  return (
    <Link href={href} className="college-card block overflow-hidden">
      <div
        className="h-32 w-full bg-cover bg-center"
        style={{
          backgroundColor: "var(--college-teal-100)",
          backgroundImage: metier.image ? `url(${metier.image})` : undefined,
        }}
      />
      <div className="p-3">
        <p className="text-xs font-semibold" style={{ color: "var(--college-teal-700)" }}>
          {metier.domaine}
        </p>
        <p className="font-semibold text-sm mt-0.5">{metier.nom}</p>
        <p className="text-xs mt-1 line-clamp-2" style={{ color: "var(--college-ink-600)" }}>
          {metier.descriptionCourte}
        </p>
      </div>
    </Link>
  );
}
