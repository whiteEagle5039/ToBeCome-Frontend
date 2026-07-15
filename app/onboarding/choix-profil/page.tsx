import Link from "next/link"
import { GraduationCap, Users, Building2 } from "lucide-react"

const PROFILES = [
  {
    id: "eleve",
    label: "Élève",
    description: "Découvre qui tu es et explore les métiers",
    href: "/onboarding/choix-niveau",
    icon: GraduationCap,
  },
  {
    id: "parent",
    label: "Parent",
    description: "Suis le parcours d'orientation de ton enfant",
    href: "/parent/auth/login",
    icon: Users,
  },
  {
    id: "etablissement",
    label: "Établissement",
    description: "Pilote l'orientation de tes élèves",
    href: "/etablissement/inscription",
    icon: Building2,
  },
] as const

export default function ChoixProfilPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 px-6 py-12">
      <div className="space-y-2 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#0F766E]">
          To Be.Come
        </p>
        <h1 className="text-2xl font-bold text-neutral-900 md:text-3xl">
          Qui es-tu ?
        </h1>
        <p className="text-sm text-neutral-500 md:text-base">
          Crée ton profil pour accéder à ton espace.
        </p>
      </div>

      <div className="grid w-full max-w-3xl grid-cols-1 gap-5 sm:grid-cols-3">
        {PROFILES.map((profile) => {
          const Icon = profile.icon
          return (
            <Link
              key={profile.id}
              href={profile.href}
              className="group flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-sm transition-all hover:border-[#0F766E] hover:shadow-md"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0F766E]/10 text-[#0F766E] transition-colors group-hover:bg-[#0F766E] group-hover:text-white">
                <Icon className="h-7 w-7" strokeWidth={1.75} />
              </span>
              <span className="font-semibold text-neutral-900">
                {profile.label}
              </span>
              <span className="text-xs leading-snug text-neutral-500">
                {profile.description}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
