import Image from "next/image"

const steps = [
  {
    number: 1,
    title: "Souscription",
    text: "L'établissement s'abonne et génère des matricules sécurisés pour ses élèves et parents.",
    image: "/step-subscription.png",
    alt: "Tableau de bord de souscription de l'établissement",
  },
  {
    number: 2,
    title: "Exploration Élève",
    text: "L'élève s'inscrit avec son matricule et explore les métiers à travers des vidéos et des missions.",
    image: "/step-exploration.png",
    alt: "Élève explorant les métiers sur smartphone",
  },
  {
    number: 3,
    title: "Suivi Parent",
    text: "Le parent suit la progression de son enfant en temps réel et consulte son profil RIASEC.",
    image: "/step-suivi.png",
    alt: "Parent suivant la progression de son enfant",
  },
]

export function HowItWorksSection() {
  return (
    <section id="fonctionnement" className="bg-[#DFF6F3] py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-center text-balance text-3xl font-bold tracking-tight text-[#0F766E] sm:text-4xl">
          Comment fonctionne To Be.Come ?
        </h2>

        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center text-center">
              <span className="flex size-14 items-center justify-center rounded-full bg-[#FFCB05] text-xl font-bold text-black">
                {step.number}
              </span>
              <h3 className="mt-5 text-xl font-semibold text-[#0F766E]">
                {step.title}
              </h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-black">
                {step.text}
              </p>
              <div className="mt-6 w-full overflow-hidden rounded-2xl border border-border/60 shadow-sm">
                <Image
                  src={step.image}
                  alt={step.alt}
                  width={400}
                  height={300}
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
