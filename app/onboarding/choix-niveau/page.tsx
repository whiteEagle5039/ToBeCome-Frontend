import Link from "next/link"
import { ArrowLeft, School, BookOpenText } from "lucide-react"

const NIVEAUX = [
  {
    id: "collegien",
    label: "Collégien",
    description: "De la 6e à la 3e",
    href: "/college/connexion",
    icon: School,
  },
  {
    id: "lyceen",
    label: "Lycéen",
    description: "De la 2nde à la Terminale",
    href: "/eleve/connexion",
    icon: BookOpenText,
  },
] as const

export default function ChoixNiveauPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-10 px-6 py-12">
      <Link
        href="/onboarding/choix-profil"
        className="absolute left-6 top-6 inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour
      </Link>

      <div className="space-y-2 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#0F766E]">
          Espace Élève
        </p>
        <h1 className="text-2xl font-bold text-neutral-900 md:text-3xl">
          Tu es en...
        </h1>
        <p className="text-sm text-neutral-500 md:text-base">
          On adapte ton expérience à ton niveau.
        </p>
      </div>

      <div className="grid w-full max-w-xl grid-cols-1 gap-5 sm:grid-cols-2">
        {NIVEAUX.map((niveau) => {
          const Icon = niveau.icon
          return (
            <Link
              key={niveau.id}
              href={niveau.href}
              className="group flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-sm transition-all hover:border-[#FFCB05] hover:shadow-md"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFCB05]/20 text-[#0F766E] transition-colors group-hover:bg-[#FFCB05]">
                <Icon className="h-7 w-7" strokeWidth={1.75} />
              </span>
              <span className="font-semibold text-neutral-900">
                {niveau.label}
              </span>
              <span className="text-xs leading-snug text-neutral-500">
                {niveau.description}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
