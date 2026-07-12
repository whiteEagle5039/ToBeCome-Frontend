import { EtablissementsCatalogue } from "@/components/etablissements/etablissements-catalogue"

export const metadata = {
  title: "Catalogue des établissements",
  description:
    "Retrouve tous les établissements abonnés et accède directement à leur site.",
}

export default function EtablissementsPage() {
  return (
    <div className="bg-[#DFF6F3]">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
        <header className="mb-12 space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0F766E]">
            Nos partenaires
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-[#0F766E] sm:text-4xl">
            Catalogue des établissements
          </h1>
          <div className="mx-auto h-[3px] w-14 rounded-full bg-[#FFCB05]" />
          <p className="mx-auto max-w-xl text-sm text-black/70 sm:text-base">
            Chaque établissement abonné dispose de son propre site, généré et
            hébergé par notre système. Clique sur une carte pour le découvrir.
          </p>
        </header>

        <EtablissementsCatalogue />
      </div>
    </div>
  )
}
