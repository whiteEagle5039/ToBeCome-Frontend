import { MetiersExplorer } from "@/components/metiers/metiers-explorer"

export const metadata = {
  title: "Métiers | Découvre ton futur métier",
  description:
    "Explore les métiers par domaine, découvre ce que fait chaque professionnel au quotidien et les compétences requises.",
}

export default function MetiersPage() {
  return (
    <div className="bg-[#DFF6F3]">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
        <header className="mb-10 space-y-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#0F766E]">
            Orientation
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-[#0F766E] sm:text-4xl">
            Découvre les métiers
          </h1>
          <p className="mx-auto max-w-xl text-black/70">
            Cherche un métier ou explore par domaine pour voir ce que font
            vraiment les professionnels, au jour le jour.
          </p>
        </header>

        <MetiersExplorer />
      </div>
    </div>
  )
}
