import { HelpCircle, Mail, MessageCircle } from "lucide-react";
import { Card } from "@/components/parent/ui";
import { SettingsSubHeader } from "@/components/parent/SettingsSubHeader";

const FAQ = [
  {
    q: "Comment ajouter un enfant à mon compte ?",
    a: "Depuis le tableau de bord, clique sur le bouton « + » en haut de l'écran, puis renseigne le matricule fourni par l'établissement de ton enfant.",
  },
  {
    q: "Mon enfant n'a pas encore de matricule, que faire ?",
    a: "Le matricule est généré par l'établissement scolaire. Rapproche-toi de l'administration de l'école pour l'obtenir.",
  },
  {
    q: "Comment changer la fréquence des notifications ?",
    a: "Rends-toi dans Paramètres puis dans la section « Préférences de notification » pour choisir la fréquence et les canaux.",
  },
  {
    q: "Puis-je relier plusieurs parents au même enfant ?",
    a: "Oui, chaque parent ou tuteur peut créer son propre compte et relier le même enfant via son matricule.",
  },
];

export default function AidePage() {
  return (
    <div>
      <SettingsSubHeader
        icon={HelpCircle}
        title="Aide & Support"
        subtitle="Des réponses rapides, et une équipe joignable si besoin."
      />

      <div className="mx-auto mt-6 max-w-2xl space-y-3">
        {FAQ.map((item) => (
          <Card key={item.q} className="p-5">
            <p className="font-display text-sm font-semibold text-teal-950">{item.q}</p>
            <p className="mt-1.5 text-sm text-slate">{item.a}</p>
          </Card>
        ))}
      </div>

      <Card className="mx-auto mt-4 max-w-2xl p-5">
        <p className="mb-3 text-sm font-medium text-ink">Besoin d&apos;aide supplémentaire ?</p>
        <div className="flex flex-wrap gap-2">
          <a
            href="mailto:support@tobecome.africa"
            className="focus-ring inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-teal-50"
          >
            <Mail size={15} /> support@tobecome.africa
          </a>
          <a
            href="https://wa.me/22997000000"
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-teal-50"
          >
            <MessageCircle size={15} /> WhatsApp support
          </a>
        </div>
      </Card>
    </div>
  );
}