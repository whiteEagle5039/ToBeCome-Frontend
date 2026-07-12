import { Search, Users, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const stats = [
  {
    icon: Search,
    title: "Manque d'information",
    text: "Plus de 60% des étudiants choisissent une filière sans connaître les débouchés réels du marché local.",
  },
  {
    icon: Users,
    title: "Pression Sociale",
    text: "Le poids des traditions et des attentes familiales limite souvent l'épanouissement des talents individuels.",
  },
  {
    icon: MapPin,
    title: "Fracture Territoriale",
    text: "L'accès à un conseil d'orientation de qualité reste un privilège réservé aux grandes métropoles.",
  },
]

export function ProblemSection() {
  return (
    <section className="bg-[#DFF6F3] py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-[#FFCB05] sm:text-4xl">
            L&apos;orientation, un défi majeur en Afrique
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-black">
            De nombreux élèves manquent d&apos;accompagnement pour choisir leur
            futur métier, entraînant souvent des choix par défaut.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {stats.map((stat) => (
            <Card
              key={stat.title}
              className="border-2 border-[#0F766E] bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <CardContent className="flex flex-col gap-4 p-6">
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-[#FFCB05]/20 text-[#FFCB05]">
                  <stat.icon className="size-6" />
                </span>
                <h3 className="text-lg font-semibold text-[#0F766E]">
                  {stat.title}
                </h3>
                <p className="text-sm leading-relaxed text-black">
                  {stat.text}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
