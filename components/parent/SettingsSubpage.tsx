import Link from "next/link";
import { ArrowLeft, LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export function SettingsSubpage({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/parent/parametres"
        className="focus-ring mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 hover:text-teal-800"
      >
        <ArrowLeft size={16} /> Paramètres
      </Link>
      <div className="flex items-center gap-3">
        {Icon ? (
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
            <Icon size={20} />
          </div>
        ) : null}
        <div>
          <h1 className="font-display text-2xl font-semibold text-teal-950">{title}</h1>
          {description ? <p className="text-sm text-slate">{description}</p> : null}
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}
