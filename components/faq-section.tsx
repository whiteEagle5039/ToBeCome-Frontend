import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

const faqs = [
  {
    q: "Comment fonctionne l'abonnement pour mon établissement ?",
    a: "L'établissement souscrit à une formule, puis génère automatiquement des matricules sécurisés à distribuer aux élèves et aux parents. La gestion se fait depuis un tableau de bord dédié.",
  },
  {
    q: "Comment l'élève accède-t-il à la plateforme ?",
    a: "L'élève s'inscrit en quelques minutes à l'aide du matricule fourni par son établissement. Il peut ensuite explorer les métiers, réaliser ses missions et obtenir des badges.",
  },
  {
    q: "Comment le parent suit-il la progression de son enfant ?",
    a: "Le parent dispose de son propre espace pour suivre en temps réel l'avancement de son enfant, consulter son profil RIASEC et recevoir des notifications à chaque étape clé.",
  },
  {
    q: "Mes données et celles de mon enfant sont-elles sécurisées ?",
    a: "Oui. La confidentialité est une priorité : les données sont chiffrées et hébergées de façon sécurisée. Elles ne sont jamais partagées avec des tiers sans votre consentement.",
  },
  {
    q: "Proposez-vous une période d'essai gratuite ?",
    a: "La formule Starter est entièrement gratuite et vous permet de découvrir la plateforme. Vous pouvez passer à une formule supérieure à tout moment selon vos besoins.",
  },
]

export function FaqSection() {
  return (
    <section id="faq" className="bg-[#DFF6F3] py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2  className="text-center text-balance text-3xl font-bold tracking-tight text-[#FFCB05] sm:text-4xl">
          Vos questions fréquentes
        </h2>

        <Accordion className="mt-10 flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={faq.q}
              value={`item-${i}`}
              className="rounded-2xl border-2 border-[#FFCB05] bg-[#DFF6F3] px-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <AccordionTrigger className="py-4 text-base font-semibold text-[#0F766E] hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-black/80">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
