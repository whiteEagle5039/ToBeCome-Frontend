"use client";

import { FormEvent, use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Heart, History, MessageCircle, Sparkles, Trophy } from "lucide-react";
import { useStore } from "@/lib/parent/store";
import { RiasecBars } from "@/components/parent/RiasecBars";
import { CareerChip } from "@/components/parent/CareerChip";
import { ChildAvatar } from "@/components/parent/ChildAvatar";
import { ActivityTimeline } from "@/components/parent/ActivityTimeline";
import { Button, Card, EmptyState, Pill } from "@/components/parent/ui";
import { getIcon } from "@/lib/parent/icons";
import { formatDateTime, age } from "@/lib/parent/utils";

export default function ChildDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { children, addComment } = useStore();
  const [comment, setComment] = useState("");

  const child = children.find((c) => c.id === id);
  if (!child) {
    return (
      <div className="mx-auto max-w-md">
        <EmptyState
          title="Enfant introuvable"
          description="Ce profil n'existe pas ou n'est plus relié à ton compte."
          action={
            <Link href="/parent/dashboard">
              <Button variant="ghost">Retour au tableau de bord</Button>
            </Link>
          }
        />
      </div>
    );
  }

  function handleComment(e: FormEvent) {
    e.preventDefault();
    if (!comment.trim()) return;
    addComment(child!.id, comment);
    setComment("");
  }

  return (
    <div>
      <Link href="/parent/dashboard" className="focus-ring mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 hover:underline">
        <ArrowLeft size={16} /> Retour à mes enfants
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <ChildAvatar icon={child.avatarIcon} size="lg" />
          <div>
            <h1 className="font-display text-2xl font-semibold text-teal-950">
              {child.firstName} {child.lastName}
            </h1>
            <p className="text-sm text-slate">
              {age(child.birthDate)} ans · {child.className} · {child.school}
            </p>
            <p className="text-xs text-slate">Matricule {child.matricule}</p>
          </div>
        </div>
        <Link href={`/parent/rapport/${child.id}`} target="_blank">
          <Button variant="ghost">
            <Download size={16} /> Exporter le dossier (PDF)
          </Button>
        </Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-teal-950">Profil RIASEC</h2>
              {!child.riasecCompleted && <Pill tone="yellow">Test non réalisé</Pill>}
            </div>
            {child.riasecCompleted ? (
              <>
                <div className="mb-4 flex flex-wrap gap-1.5">
                  {child.riasecDominant.map((t) => (
                    <Pill key={t} tone="teal">
                      {t}
                    </Pill>
                  ))}
                  <span className="text-sm text-slate">profil dominant</span>
                </div>
                <RiasecBars scores={child.riasecScores} />
              </>
            ) : (
              <p className="text-sm text-slate">
                {child.firstName} n&apos;a pas encore complété son test RIASEC. Cette étape est
                nécessaire pour débloquer les missions métiers et affiner les suggestions.
              </p>
            )}
          </Card>

          {child.interestPoints.length > 0 && (
            <Card className="p-6">
              <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-teal-950">
                <Sparkles size={18} className="text-yellow-500" /> Points d&apos;intérêt identifiés
              </h2>
              <ul className="space-y-2">
                {child.interestPoints.map((p, i) => (
                  <li key={i} className="flex gap-2 text-sm text-ink">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-600" />
                    {p}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <Card className="p-6">
            <h2 className="mb-3 font-display text-lg font-semibold text-teal-950">Métiers suggérés</h2>
            {child.suggestedCareerIds.length ? (
              <div className="flex flex-wrap gap-2">
                {child.suggestedCareerIds.map((cid) => (
                  <CareerChip key={cid} careerId={cid} tone="gold" />
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate">Les suggestions apparaîtront après le test RIASEC.</p>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="mb-3 font-display text-lg font-semibold text-teal-950">Métiers explorés & maîtrisés</h2>
            {child.exploredCareerIds.length ? (
              <div className="flex flex-wrap gap-2">
                {child.exploredCareerIds.map((cid) => (
                  <div key={cid} className="relative">
                    <CareerChip careerId={cid} />
                    {child.masteredCareerIds.includes(cid) && (
                      <span className="absolute -right-1.5 -top-1.5 rounded-full bg-yellow-500 px-1.5 py-0.5 text-[10px] font-bold text-teal-950">
                        maîtrisé
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate">Aucun métier exploré pour le moment.</p>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-teal-950">
              <Heart size={18} className="text-yellow-500" /> Favoris
            </h2>
            {child.favoriteCareerIds.length ? (
              <div className="flex flex-wrap gap-2">
                {child.favoriteCareerIds.map((cid) => (
                  <CareerChip key={cid} careerId={cid} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate">Aucun métier mis en favori pour le moment.</p>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-teal-950">
              <History size={18} /> Suivi d&apos;activité
            </h2>
            <p className="mb-4 text-xs text-slate">
              Tout ce que {child.firstName} a fait sur la plateforme, du plus récent au plus ancien.
            </p>
            <ActivityTimeline items={child.activity} />
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-5">
            <h2 className="mb-3 font-display text-base font-semibold text-teal-950">En un coup d&apos;œil</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-slate">Progression du parcours</dt>
                <dd className="font-semibold text-teal-800">{child.progressPercent}%</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate">Badges obtenus</dt>
                <dd className="font-semibold text-teal-800">{child.badges.length}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate">Favoris</dt>
                <dd className="font-semibold text-teal-800">{child.favoriteCareerIds.length}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate">Métiers explorés</dt>
                <dd className="font-semibold text-teal-800">{child.exploredCareerIds.length}</dd>
              </div>
            </dl>
          </Card>

          <Card className="p-5">
            <h2 className="mb-3 flex items-center gap-2 font-display text-base font-semibold text-teal-950">
              <Trophy size={17} className="text-yellow-500" /> Badges
            </h2>
            {child.badges.length ? (
              <ul className="space-y-3">
                {child.badges.map((b) => {
                  const Icon = getIcon(b.icon);
                  return (
                    <li key={b.id} className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-yellow-100 text-yellow-700">
                        <Icon size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-teal-950">{b.name}</p>
                        <p className="text-xs text-slate">{b.description}</p>
                        <p className="mt-0.5 text-[11px] text-slate">{formatDateTime(b.dateEarned)}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-xs text-slate">Aucun badge obtenu pour le moment.</p>
            )}
          </Card>

          <Card className="p-5">
            <h2 className="mb-3 flex items-center gap-2 font-display text-base font-semibold text-teal-950">
              <MessageCircle size={17} /> Accompagnement
            </h2>
            <p className="mb-3 text-xs text-slate">
              Dépose un mot bienveillant sur le parcours de {child.firstName}. Elle/il pourra le
              consulter dans son espace.
            </p>
            <form onSubmit={handleComment} className="mb-4 space-y-2">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Écris un commentaire d'encouragement…"
                className="focus-ring w-full rounded-xl border border-line bg-white px-3 py-2 text-sm placeholder:text-slate/70"
              />
              <Button type="submit" className="w-full" disabled={!comment.trim()}>
                Publier le commentaire
              </Button>
            </form>
            <div className="space-y-3">
              {child.comments.length === 0 ? (
                <p className="text-xs text-slate">Aucun commentaire pour l&apos;instant.</p>
              ) : (
                child.comments.map((c) => (
                  <div key={c.id} className="rounded-xl bg-teal-50 px-3 py-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-teal-900">{c.author}</span>
                      <span className="text-[11px] text-slate">{formatDateTime(c.date)}</span>
                    </div>
                    <p className="mt-1 text-sm text-ink">{c.text}</p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
