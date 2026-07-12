"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "Présentation", href: "/#presentation" },
  { label: "Fonctionnement", href: "/#fonctionnement" },
  { label: "Avantages", href: "/#avantages" },
  { label: "Tarifs", href: "/#tarifs" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/#contact" },
]

const extraLinks = [
  { label: "Métiers", href: "/metier" },
  { label: "Établissements", href: "/etablissements" },
]

export function SiteNavbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-[#FFCB05]/40 bg-[#DFF6F3] backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo-tobecome.png"
            alt="Logo To Be.Come"
            width={36}
            height={36}
            className="size-9"
          />
          <span className="text-lg font-bold tracking-tight text-[#0F766E]">
            To Be.Come
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-black/70 transition-colors hover:text-[#0F766E]"
            >
              {link.label}
            </Link>
          ))}

          {extraLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-black/70 transition-colors hover:text-[#0F766E]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            render={<Link href="/onboarding/choix-profil" />}
            nativeButton={false}
            className="hidden rounded-full bg-[#FFCB05] font-semibold text-black shadow-md transition-all hover:-translate-y-1 hover:border-2 hover:border-[#FFCB05] hover:bg-[#DFF6F3] hover:text-black hover:shadow-lg sm:inline-flex"
          >
            Qui es-tu ?
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-10 items-center justify-center rounded-lg text-foreground lg:hidden"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-[#FFCB05]/40 bg-[#DFF6F3] transition-[max-height] duration-300 lg:hidden",
          open ? "max-h-96" : "max-h-0 border-t-0",
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-black/70 transition-all hover:-translate-y-1 hover:bg-[#FFCB05] hover:text-black"
            >
              {link.label}
            </Link>
          ))}

          {extraLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-black/70 transition-all hover:-translate-y-1 hover:bg-[#FFCB05] hover:text-black"
            >
              {link.label}
            </Link>
          ))}

          <Button
            render={<Link href="/onboarding/choix-profil" onClick={() => setOpen(false)} />}
            nativeButton={false}
            className="mt-2 rounded-full bg-[#FFCB05] font-semibold text-black shadow-md transition-all hover:-translate-y-1 hover:border-2 hover:border-[#FFCB05] hover:bg-[#DFF6F3] hover:text-black hover:shadow-lg"
          >
            Qui es-tu ?
          </Button>
        </nav>
      </div>
    </header>
  )
}
