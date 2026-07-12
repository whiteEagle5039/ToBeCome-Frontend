import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Plan = {
  name: string
  price: string
  priceSuffix?: string
  highlighted?: boolean
  features: { label: string; included: boolean }[]
  cta: string
}

const plans: Plan[] = [
  {
    name: "Starter",
    price: "Free",
    features: [
      { label: "Test d'orientation basique", included: true },
      { label: "Accès au catalogue", included: true },
      { label: "Mentorat individuel", included: false },
    ],
    cta: "Commencer",
  },
  {
    name: "Pro",
    price: "25.000",
    priceSuffix: "FCFA",
    highlighted: true,
    features: [
      { label: "Bilan de compétences complet", included: true },
      { label: "2 sessions avec mentor", included: true },
      { label: "Support par e-mail", included: true },
    ],
    cta: "Choisir Pro",
  },
  {
    name: "Premium",
    price: "60.000",
    priceSuffix: "FCFA",
    features: [
      { label: "Accès illimité aux mentors", included: true },
      { label: "Suivi annuel personnalisé", included: true },
      { label: "Ateliers de soft skills", included: true },
    ],
    cta: "Passer Premium",
  },
]

export function PricingSection() {
  return (
    <section id="tarifs" className="bg-[#DFF6F3] py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-center text-balance text-3xl font-bold tracking-tight text-[#0F766E] sm:text-4xl">
          Des formules adaptées à votre établissement
        </h2>

        <div className="mt-12 grid items-start gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative flex flex-col gap-6 rounded-3xl border-2 border-[#FFCB05] bg-white p-6 shadow-md transition-all hover:-translate-y-2 hover:shadow-xl",
                plan.highlighted
                  ? "border-[#FFCB05] shadow-xl md:-translate-y-3 md:p-8"
                  : "border-border/60",
              )}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#FFCB05] px-4 py-1 text-xs font-bold uppercase tracking-wide text-black shadow-md">
                Recommandé</span>
              )}
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#0F766E]">
                  {plan.name}
                </p>
               <p className="mt-3 text-4xl font-extrabold text-black">
                  {plan.price}
                  {plan.priceSuffix && (
                    <span className="ml-1 text-base font-semibold text-black/70">
                      {plan.priceSuffix}
                    </span>
                  )}
                </p>
              </div>

              <ul className="flex flex-col gap-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature.label}
                    className={cn(
                      "flex items-center gap-2 text-sm",
                      feature.included ? "text-black" : "text-gray-400",
                    )}
                  >
                    {feature.included ? (
                      <Check className="size-4 shrink-0 text-[#0F766E]" />
                    ) : (
                      <X className="size-4 shrink-0" />
                    )}
                    {feature.label}
                  </li>
                ))}
              </ul>

              <Button
                className={cn(
                  "mt-auto w-full rounded-full font-semibold shadow-md transition-all hover:-translate-y-1 hover:shadow-lg",
                  plan.highlighted
                    ? "bg-[#FFCB05] text-black hover:bg-[#FFCB05]/90"
                    : "border-2 border-[#0F766E] bg-transparent text-[#0F766E] hover:bg-[#0F766E] hover:text-white",
                )}
                variant={plan.highlighted ? "default" : "outline"}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
