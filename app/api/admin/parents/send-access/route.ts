import { NextResponse } from "next/server"
import { randomBytes } from "crypto"
import { prisma } from "@/lib/prisma"
import { envoyerMail } from "@/lib/server/mail"

function genererTokenReinitialisation(): string {
  return randomBytes(32).toString("hex")
}

function genererLienReinitialisation(req: Request, token: string): string {
  const url = new URL("/parent/auth/mot-de-passe-oublie", req.url)
  url.searchParams.set("token", token)
  return url.toString()
}

async function preparerEnvoiPourParent(req: Request, parent: {
  id: string
  userId: string
  prenom: string
  nom: string
  user: { email?: string | null }
}) {
  const token = genererTokenReinitialisation()
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24)

  await prisma.passwordResetToken.create({
    data: {
      userId: parent.userId,
      token,
      expiresAt,
    },
  })

  const email = parent.user.email?.trim().toLowerCase() ?? ""
  if (!email) {
    return {
      parentId: parent.id,
      email: "",
      success: false,
      error: "Email manquant",
    }
  }

  const lien = genererLienReinitialisation(req, token)
  const nomComplet = `${parent.prenom} ${parent.nom}`.trim()
  const emailEnvoye = await envoyerMail({
    to: email,
    subject: "To Be.Come — Accès parent",
    text: [
      `Bonjour ${nomComplet || "parent"},`,
      "",
      "Votre accès parent est prêt.",
      "Définissez votre mot de passe en cliquant sur le lien ci-dessous :",
      "",
      lien,
      "",
      "Ce lien est personnel et à usage unique.",
      "Si vous n'êtes pas à l'origine de cette demande, ignorez simplement ce message.",
      "",
      "L'équipe To Be.Come",
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
        <p>Bonjour ${nomComplet || "parent"},</p>
        <p>Votre accès parent est prêt.</p>
        <p>
          <a href="${lien}" style="display:inline-block;background:#0f766e;color:#fff;text-decoration:none;padding:12px 18px;border-radius:999px">
            Définir mon mot de passe
          </a>
        </p>
        <p style="word-break:break-all"><a href="${lien}">${lien}</a></p>
        <p>Ce lien est personnel et à usage unique.</p>
        <p>Si vous n'êtes pas à l'origine de cette demande, ignorez simplement ce message.</p>
        <p>L'équipe To Be.Come</p>
      </div>
    `,
  })

  return {
    parentId: parent.id,
    email,
    success: emailEnvoye,
    error: emailEnvoye ? undefined : "Envoi e-mail impossible",
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as { parentId?: string }
    const parentId = body.parentId?.trim()

    if (parentId) {
      const parent = await prisma.parentProfile.findUnique({
        where: { id: parentId },
        include: { user: true },
      })

      if (!parent) {
        return NextResponse.json({ error: "Parent introuvable" }, { status: 404 })
      }

      const result = await preparerEnvoiPourParent(req, parent)
      return NextResponse.json({
        sent: result.success ? 1 : 0,
        total: 1,
        results: [result],
      })
    }

    const parents = await prisma.parentProfile.findMany({
      include: { user: true },
      orderBy: { createdAt: "asc" },
    })

    const results: Array<{
      parentId: string
      email: string
      success: boolean
      error?: string
    }> = []
    for (const parent of parents) {
      // L'envoi est séquentiel pour conserver des résultats détaillés par parent.
      // Le volume ciblé ici reste généralement limité.
      // eslint-disable-next-line no-await-in-loop
      results.push(await preparerEnvoiPourParent(req, parent))
    }

    return NextResponse.json({
      sent: results.filter((r) => r.success).length,
      total: results.length,
      results,
    })
  } catch (error) {
    console.error("[admin/parents/send-access]", error)
    return NextResponse.json({ error: "Envoi des accès impossible" }, { status: 500 })
  }
}
