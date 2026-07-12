"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, PlayCircle } from "lucide-react";
import { CAREERS, RIASEC_LABELS } from "@/lib/parent/mockData";
import { Card, EmptyState, Pill } from "@/components/parent/ui";
import { fetchPublicMetier } from "@/lib/api/metiers";
import type { RiasecType } from "@/lib/parent/types";

interface CareerDetail {
  slug: string;
  title: string;
  domain: string;
  summary: string;
  description: string;
  videoLength: string;
  riasec: RiasecType[];
}

export default function CareerDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [career, setCareer] = useState<CareerDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const data = await fetchPublicMetier(slug);
        if (!active) return;
        setCareer({
          slug: data.slug,
          title: data.titre,
          domain: data.domaineNom ?? data.domaineId,
          summary: data.description,
          description: data.ceQuIlFait,
          videoLength: "45s",
          riasec: (data.competences ?? []) as RiasecType[],
        });
      } catch {
        const fallback = CAREERS.find((c) => c.slug === slug);
        if (active && fallback) {
          setCareer({
            slug: fallback.slug,
            title: fallback.title,
            domain: fallback.domain,
            summary: fallback.summary,
            description: fallback.description,
            videoLength: fallback.videoLength,
            riasec: fallback.riasec,
          });
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return <p className="text-sm text-slate">Chargement…</p>;
  }

  if (!career) {
    return (
      <div className="mx-auto max-w-md">
        <EmptyState
          title="Métier introuvable"
          description="Cette fiche métier n'existe pas dans le catalogue."
          action={
            <Link href="/parent/metiers" className="focus-ring text-sm font-semibold text-teal-700 hover:underline">
              Retour au catalogue
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/parent/metiers" className="focus-ring mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 hover:underline">
        <ArrowLeft size={16} /> Retour au catalogue
      </Link>

      <div className="relative flex h-56 items-center justify-center overflow-hidden rounded-2xl bg-teal-900 text-white">
        <PlayCircle size={56} className="opacity-90" />
        <span className="absolute bottom-3 right-3 rounded-full bg-black/40 px-2.5 py-1 text-xs">
          Vidéo métier · {career.videoLength}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Pill tone="slate">{career.domain}</Pill>
        {career.riasec.map((t) => (
          <Pill key={t} tone="teal">
            {RIASEC_LABELS[t]}
          </Pill>
        ))}
      </div>

      <h1 className="mt-3 font-display text-2xl font-semibold text-teal-950">{career.title}</h1>
      <p className="mt-2 text-sm font-medium text-slate">{career.summary}</p>

      <Card className="mt-6 p-6">
        <h2 className="mb-2 font-display text-base font-semibold text-teal-900">En quoi ça consiste ?</h2>
        <p className="text-sm leading-relaxed text-ink">{career.description}</p>
      </Card>
    </div>
  );
}
