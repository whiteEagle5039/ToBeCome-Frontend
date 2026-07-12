import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Retourne les 36 questions (avec leur bloc et leurs options, sans les
 * pondérations — elles restent côté serveur). L'ordre des options des
 * questions SCENARIO est randomisé à chaque appel (anti-guidage) ;
 * les échelles gardent leur ordre.
 */
export async function GET() {
  const questions = await prisma.questionRiasec.findMany({
    where: { active: true },
    orderBy: { ordre: "asc" },
    include: {
      bloc: true,
      options: { orderBy: { ordre: "asc" } },
    },
  });

  const payload = questions.map((q) => {
    let options = q.options.map((o) => ({ id: o.id, texte: o.texte }));
    if (q.type === "SCENARIO") {
      options = options
        .map((o) => ({ o, r: Math.random() }))
        .sort((a, b) => a.r - b.r)
        .map(({ o }) => o);
    }
    return {
      id: q.id,
      ordre: q.ordre,
      type: q.type,
      intitule: q.intitule,
      bloc: { numero: q.bloc.numero, titre: q.bloc.titre, couleur: q.bloc.couleur },
      options,
    };
  });

  return NextResponse.json({ questions: payload });
}
