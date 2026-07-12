import { Lock } from "lucide-react";
import { Card } from "@/components/parent/ui";
import { SettingsSubHeader } from "@/components/parent/SettingsSubHeader";

export default function PolitiqueConfidentialitePage() {
  return (
    <div>
      <SettingsSubHeader icon={Lock} title="Politique de confidentialité" subtitle="Dernière mise à jour : à définir" />

      <Card className="mx-auto mt-6 max-w-2xl space-y-4 p-6 text-sm leading-relaxed text-ink">
        <p className="text-xs font-medium text-yellow-700">
          Texte provisoire — à faire relire et compléter par un juriste avant mise en production.
        </p>

        <section>
          <h2 className="mb-1 font-display font-semibold text-teal-950">Données collectées</h2>
          <p>
            Nous collectons les informations de profil (nom, email, téléphone) du parent, ainsi
            que celles nécessaires au suivi scolaire de l&apos;enfant (matricule, classe,
            établissement, résultats RIASEC, progression).
          </p>
        </section>

        <section>
          <h2 className="mb-1 font-display font-semibold text-teal-950">Utilisation des données</h2>
          <p>
            Les données servent uniquement à fournir le service d&apos;orientation et de suivi
            parental. Elles ne sont jamais vendues à des tiers.
          </p>
        </section>

        <section>
          <h2 className="mb-1 font-display font-semibold text-teal-950">Partage avec l&apos;établissement</h2>
          <p>
            Selon tes réglages de confidentialité, l&apos;établissement de tes enfants peut avoir
            accès à leur progression globale, à des fins de suivi pédagogique.
          </p>
        </section>

        <section>
          <h2 className="mb-1 font-display font-semibold text-teal-950">Tes droits</h2>
          <p>
            Tu peux à tout moment demander une copie de tes données (section « Télécharger mes
            données ») ou la suppression de ton compte (section « Supprimer mon compte »).
          </p>
        </section>
      </Card>
    </div>
  );
}