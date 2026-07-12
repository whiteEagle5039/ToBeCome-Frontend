"use client"

import type { FormEvent } from "react"
import { useState } from "react"
import { Mail, Phone, MessageCircle, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Card, CardContent } from "@/components/ui/card"

export function ContactSection() {
  const [sent, setSent] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section id="contact" className="bg-[#DFF6F3] py-16 text-black md:py-24">
      <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-[#0F766E] sm:text-4xl">
            Parlons de votre avenir
          </h2>
          <p className="max-w-md text-pretty leading-relaxed text-black/80">
            Besoin d&apos;un conseil personnalisé ? Notre équipe est disponible
            pour répondre à toutes vos interrogations.
          </p>
          <ul className="flex flex-col gap-4 text-sm">
            <li className="flex items-center gap-3">
              <span className="inline-flex size-10 items-center justify-center rounded-full bg-[#0F766E]/10 text-[#0F766E]">
                <Mail className="size-4" />
              </span>
              contact@tobe.come.com
            </li>
            <li className="flex items-center gap-3">
              <span className="inline-flex size-10 items-center justify-center rounded-full bg-[#0F766E]/10 text-[#0F766E]">
                <Phone className="size-4" />
              </span>
              +229 01 00 00 00 00
            </li>
          </ul>
          <Button
            variant="outline"
            render={
              <a href="https://wa.me/229 01 00 00 00 00" target="_blank" rel="noreferrer" />
            }
            nativeButton={false}
            size="lg"
            className="w-fit rounded-full border-2 border-[#FFCB05] bg-transparent font-semibold text-black shadow-md transition-all hover:-translate-y-1 hover:bg-[#FFCB05] hover:text-black hover:shadow-lg"
          >
            <MessageCircle data-icon="inline-start" />
            Nous contacter sur WhatsApp
          </Button>
        </div>

        <Card className="border-none shadow-xl bg-[#0F766E]">
          <CardContent className="p-6 sm:p-8">
            {sent ? (
              <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-center">
                <span className="inline-flex size-12 items-center justify-center rounded-full bg-accent text-primary">
                  <Send className="size-5" />
                </span>
                <p className="text-lg font-semibold text-white">
                  Message envoyé !
                </p>
                <p className="text-sm text-white/80">
                  Merci, nous reviendrons vers vous très vite.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <FieldGroup>
                  <Field>
                    <FieldLabel className="text-white" htmlFor="nom">Nom</FieldLabel>
                    <Input className=" bg-[#DFF6F3] text-black placeholder:text-black/50"
                    id="nom" name="nom" placeholder="Votre nom" required /> 
                  </Field>

                  <Field>
                    <FieldLabel className="text-white" htmlFor="email">Email</FieldLabel>
                    <Input 
                      className="
                      bg-[#DFF6F3] 
                      text-black 
                      placeholder:text-black/50"
                      id="email"
                      name="email"
                      type="email"
                      placeholder="votre@email.com"
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel className="text-white" htmlFor="sujet">Sujet</FieldLabel>
                    <Input className=" bg-[#DFF6F3] text-black placeholder:text-black/50" id="sujet" name="sujet" placeholder="Objet de votre message" required />
                  </Field>

                  <Field>
                    <FieldLabel className="text-white" htmlFor="message">Message</FieldLabel>

                    <Textarea
                      className="
                     bg-[#DFF6F3] text-black placeholder:text-black/50"
                      id="message"
                      name="message"
                      rows={4}
                      placeholder="Comment pouvons-nous vous aider ?"
                      required
                    />
                  </Field>
                  <Button
                    type="submit"
                    className="w-full rounded-full bg-[#FFCB05] font-semibold text-black shadow-md transition-all hover:-translate-y-1 hover:bg-[#FFCB05]/90 hover:shadow-lg"
                  >
                    <Send data-icon="inline-start" />
                    Envoyer le message
                  </Button>
                </FieldGroup>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
