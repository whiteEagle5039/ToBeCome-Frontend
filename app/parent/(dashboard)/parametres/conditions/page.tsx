import { FileText } from "lucide-react";
import { Card } from "@/components/parent/ui";
import { SettingsSubHeader } from "@/components/parent/SettingsSubHeader";

export default function ConditionsPage() {
  return (
    <div>
      <SettingsSubHeader icon={FileText} title="Conditions d'utilisation" subtitle="Dernière mise à jour : à définir" />

      <Card className="mx-auto mt-6 max-w-2xl space-y-4 p-6 text-sm leading-relaxed text-ink">
        <p className="text-xs font-medium text-yellow-700">
          Texte provisoire — à faire relire et compléter par un juriste avant mise en production.
        </p>

        <section>
          <h2 className="mb-1 font-display font-semibold text-teal-950">1. Objet</h2>
          <p>
            To be.come est une plateforme d&apos;orientation scolaire permettant aux élèves
            d&apos;explorer des métiers et aux parents de suivre leur progression. L&apos;usage de
            l&apos;espace parent est soumis aux présentes conditions.
          </p>
        </section>

        <section>
          <h2 className="mb-1 font-display font-semibold text-teal-950">2. Compte parent</h2>
          <p>
            Le compte parent permet de relier un ou plusieurs enfants via leur matricule scolaire.
            Le parent est responsable de la confidentialité de ses identifiants de connexion.
          </p>
        </section>

        <section>
          <h2 className="mb-1 font-display font-semibold text-teal-950">3. Utilisation autorisée</h2>
          <p>
            Le service est destiné à un usage personnel et familial de suivi de l&apos;orientation
            scolaire. Toute utilisation frauduleuse ou détournée pourra entraîner la suspension du
            compte.
          </p>
        </section>

        <section>
          <h2 className="mb-1 font-display font-semibold text-teal-950">4. Modification des conditions</h2>
          <p>
            Ces conditions peuvent évoluer. Les utilisateurs seront informés de toute modification
            substantielle.
          </p>
        </section>
      </Card>
    </div>
  );
}