import { Info } from "lucide-react";
import { Card } from "@/components/parent/ui";
import { SettingsSubHeader } from "@/components/parent/SettingsSubHeader";
import { Brand } from "@/components/parent/Brand";

export default function AProposPage() {
  return (
    <div>
      <SettingsSubHeader icon={Info} title="À propos" />

      <Card className="mx-auto mt-6 max-w-2xl p-6 text-center">
        <div className="flex justify-center">
          <Brand />
        </div>
        <p className="mt-3 text-sm text-slate">Version 1.0.0 — Espace parent</p>
        <p className="mx-auto mt-4 max-w-md text-sm text-ink">
          To be.come aide les élèves à explorer des métiers et à mieux se connaître grâce au test
          RIASEC, et permet aux parents de suivre ce parcours d&apos;orientation en toute
          simplicité.
        </p>
        <p className="mt-4 text-xs text-slate">© {new Date().getFullYear()} To be.come. Tous droits réservés.</p>
      </Card>
    </div>
  );
}