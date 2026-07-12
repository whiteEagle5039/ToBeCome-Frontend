import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type ModeCardProps = {
  href: string;
  icon: LucideIcon;
  titre: string;
  description: string;
};

export function ModeCard({ href, icon: Icon, titre, description }: ModeCardProps) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-3 rounded-xl border border-espace-border bg-white p-5 transition hover:border-espace-primary hover:shadow-sm"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-espace-surface text-espace-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="font-semibold text-espace-ink">{titre}</h3>
        <p className="mt-1 text-sm text-espace-muted">{description}</p>
      </div>
    </Link>
  );
}
