// components/metiers/metier-dialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";
import type { Domaine, Metier } from "@/lib/metiers-data";

export function MetierDialog({
  metier,
  domaine,
  open,
  onOpenChange,
}: {
  metier: Metier | null;
  domaine?: Domaine;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const Icon = domaine?.icon;
  const gradFrom = domaine?.gradFrom ?? "#0F766E";
  const gradTo = domaine?.gradTo ?? "#134E4A";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden rounded-3xl border-none p-0 sm:max-w-xl">
        <DialogHeader className="sr-only">
          <DialogTitle>{metier?.titre}</DialogTitle>
        </DialogHeader>

        {metier ? (
          <div className="max-h-[85vh] overflow-y-auto">
            {/* Hero */}
            <div
              className="relative flex h-56 flex-col justify-end p-6"
              style={{
                backgroundImage: metier.image
                  ? `linear-gradient(to top, rgba(0,0,0,.65), rgba(0,0,0,.05)), url(${metier.image})`
                  : `linear-gradient(135deg, ${gradFrom}, ${gradTo})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {domaine ? (
                <span
                  className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-white backdrop-blur-sm"
                  style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                >
                  {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
                  {domaine.nom}
                </span>
              ) : null}
              <h2 className="text-2xl font-bold leading-tight text-white drop-shadow-sm">
                {metier.titre}
              </h2>
              <p className="mt-1 text-sm text-white/85">
                {metier.description}
              </p>
            </div>

            {/* Corps */}
            <div className="space-y-7 p-6 sm:p-8">
              <section>
                <h4
                  className="mb-2 text-xs font-semibold uppercase tracking-wide"
                  style={{ color: gradFrom }}
                >
                  Ce que fait le professionnel
                </h4>
                <p className="text-[15px] leading-relaxed text-foreground/80">
                  {metier.ceQuIlFait}
                </p>
              </section>

              <section>
                <h4
                  className="mb-3 text-xs font-semibold uppercase tracking-wide"
                  style={{ color: gradFrom }}
                >
                  Tâches quotidiennes
                </h4>
                <ul className="space-y-2.5">
                  {metier.tachesQuotidiennes.map((tache) => (
                    <li key={tache} className="flex items-start gap-2.5">
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0"
                        style={{ color: gradFrom }}
                      />
                      <span className="text-sm text-foreground/80">
                        {tache}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h4
                  className="mb-3 text-xs font-semibold uppercase tracking-wide"
                  style={{ color: gradFrom }}
                >
                  Compétences clés
                </h4>
                <div className="flex flex-wrap gap-2">
                  {metier.competences.map((c) => (
                    <span
                      key={c}
                      className="rounded-full px-3 py-1 text-xs font-medium"
                      style={{
                        backgroundColor: `${gradFrom}1a`,
                        color: gradFrom,
                      }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </section>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}