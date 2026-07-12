import Link from "next/link";
import { ArrowLeft, type LucideIcon } from "lucide-react";

interface SettingsSubHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
}

export function SettingsSubHeader({ icon: Icon, title, subtitle }: SettingsSubHeaderProps) {
  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/parent/parametres"
        className="focus-ring mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 hover:underline"
      >
        <ArrowLeft size={16} /> Retour aux paramètres
      </Link>
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
          <Icon size={20} />
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold text-teal-950">{title}</h1>
          {subtitle && <p className="text-sm text-slate">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}