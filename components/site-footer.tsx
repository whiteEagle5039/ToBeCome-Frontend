import type { SVGProps } from "react"
import Image from "next/image"
import Link from "next/link"

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

const societe = [
  { label: "À propos", href: "/#presentation" },
  { label: "Notre équipe", href: "#" },
  { label: "Partenaires", href: "#" },
  { label: "Presse", href: "#" },
]

const legal = [
  { label: "Mentions Légales", href: "#" },
  { label: "Confidentialité", href: "#" },
  { label: "Cookies", href: "#" },
  { label: "Support", href: "#" },
]

const socials = [
  { label: "Instagram", icon: InstagramIcon, href: "#" },
  { label: "LinkedIn", icon: LinkedinIcon, href: "#" },
  { label: "Facebook", icon: FacebookIcon, href: "#" },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-[#DFF6F3] py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo-tobecome.png"
                alt="Logo To Be.Come"
                width={36}
                height={36}
                className="size-9"
              />
              <span className="text-lg font-bold text-[#0F766E]">To Be.Come</span>
            </Link>
           <p className="max-w-xs text-sm leading-relaxed text-black/70">
              Accompagner la jeunesse africaine vers l&apos;excellence
              professionnelle.
            </p>
            <div className="flex items-center gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                 className="inline-flex size-9 items-center justify-center rounded-full border-2 border-[#0F766E] text-[#0F766E] transition-all hover:-translate-y-1 hover:border-[#FFCB05] hover:bg-[#FFCB05] hover:text-black"
                >
                  <social.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#0F766E]">Société</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {societe.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm text-black/70 transition-colors hover:text-[#0F766E]"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#0F766E]">Légal</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {legal.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm text-black/70 transition-colors hover:text-[#0F766E]"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#0F766E]">Newsletter</h3>
           <p className="mt-4 text-sm text-black/70">
              Recevez nos conseils d&apos;orientation chaque mois.
            </p>
            <form className="mt-4 flex items-center gap-2">
              <input
                type="email"
                placeholder="Email"
                aria-label="Adresse email"
               className="h-10 w-full rounded-full border border-[#FFCB05] bg-white px-4 text-sm text-black shadow-sm transition-all duration-300 outline-none hover:shadow-md focus-visible:-translate-y-1 focus-visible:border-[#0F766E] focus-visible:ring-2 focus-visible:ring-[#0F766E]/30"
              />
              <button
                type="submit"
                aria-label="S'abonner"
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[#0F766E] text-white shadow-md transition-all hover:-translate-y-1 hover:bg-[#0F766E]/90 hover:shadow-xl"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 border-t-2 border-[#FFCB05] pt-6 text-center text-sm text-black/60">
 
          © 2026 To Be.Come. Tous droits réservés.
        </div>
      </div>
    </footer>
  )
}
