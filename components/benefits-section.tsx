import { GraduationCap, Users, Building2, Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const profiles = [
  {
    icon: GraduationCap,
    title: "Pour l'Élève",
    items: [
      "Explorer les métiers",
      "Faire des missions d'orientation",
      "Obtenir des badges",
    ],
  },
  {
    icon: Users,
    title: "Pour le Parent",
    items: [
      "Suivre son enfant en temps réel",
      "Consulter son profil RIASEC",
      "Recevoir des notifications",
    ],
  },
  {
    icon: Building2,
    title: "Pour les Établissements",
    items: [
      "Piloter l'orientation",
      "Générer des rapports",
      "Gérer les classes",
    ],
  },
]

export function BenefitsSection() {
  return (
    <section id="avantages" className="bg-[#DFF6F3] py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-center text-balance text-3xl font-bold tracking-tight text-[#FFCB05] sm:text-4xl">
          Une plateforme pensée pour chacun
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {profiles.map((profile) => (
            <Card
              key={profile.title}
              className="border-2 border-[#FFCB05] bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <CardHeader>
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-[#0F766E]/10 text-[#0F766E]">
                  <profile.icon className="size-6" />
                </span>
                <CardTitle className="mt-3 text-lg text-[#0F766E]">{profile.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-col gap-3">
                  {profile.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm text-black"
                    >
                      <Check className="size-4 shrink-0 text-[#FFCB05]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
