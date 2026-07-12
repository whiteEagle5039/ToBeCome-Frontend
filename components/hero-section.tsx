import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section id="presentation" className="bg-[#DFF6F3]">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight text-[#0F766E] sm:text-5xl">
            Aide ton enfant à trouver sa voie
          </h1>
          <p className="max-w-xl text-pretty text-base leading-relaxed text-neutral-700 sm:text-lg">
            To Be.Come accompagne les élèves dans leur orientation avec des
            missions, des vidéos métiers et un suivi personnalisé.
          </p>
          <div className="flex">
            <Button
              render={<Link href="/onboarding/choix-profil" />}
              nativeButton={false}
              size="lg"
              className="rounded-full border-2 border-[#FFCB05] bg-[#FFCB05] px-8 font-semibold text-black shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#0F766E] hover:border-[#0F766E] hover:text-white hover:shadow-lg"
            >
              Qui es-tu ?
              <ArrowRight data-icon="inline-end" />
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-3xl shadow-2xl ring-1 ring-primary-foreground/20">
            <Image
              src="/hero-student.png"
              alt="Élève souriant tenant une tablette, accompagné dans son orientation"
              width={720}
              height={720}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
