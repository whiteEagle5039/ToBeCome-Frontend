import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      token?: string
      newPassword?: string
    }

    const token = body.token?.trim()
    const newPassword = body.newPassword ?? ""

    if (!token || !newPassword) {
      return NextResponse.json({ error: "Token ou mot de passe manquant" }, { status: 400 })
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: "Le mot de passe doit contenir au moins 8 caractères" }, { status: 400 })
    }

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    })

    if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
      return NextResponse.json({ error: "Lien de réinitialisation invalide ou expiré" }, { status: 400 })
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: await bcrypt.hash(newPassword, 12) },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used: true },
      }),
    ])

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[parent/password/reset]", error)
    return NextResponse.json({ error: "Réinitialisation impossible" }, { status: 500 })
  }
}
