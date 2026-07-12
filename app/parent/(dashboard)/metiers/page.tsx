"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Lightbulb, LayoutGrid, Video } from "lucide-react";
import { RIASEC_LABELS } from "@/lib/parent/mockData";
import { careersInDomain } from "@/lib/parent/utils";
import { getIcon } from "@/lib/parent/icons";
import { Card, EmptyState, Pill } from "@/components/parent/ui";
import { DomainCarousel } from "@/components/parent/DomainCarousel";
import { SuggestMetierDialog } from "@/components/parent/SuggestMetierDialog";
import { VideoFeed } from "@/components/parent/VideoFeed";
import { fetchPublicDomaines, fetchPublicMetiers } from "@/lib/api/metiers";
import { DOMAINS, CAREERS } from "@/lib/parent/mockData";
import type { RiasecType } from "@/lib/parent/types";

type Mode = "fiche" | "video";

interface CareerItem {
  id: string;
  slug: string;
  title: string;
  domain: string;
  domainSlug: string;
  summary: string;
  description: string;
  videoLength: string;
  riasec: RiasecType[];
}

function mapApiCareer(m: {
  id: string;
  slug: string;
  titre: string;
  domaineId: string;
  domaineNom?: string;
  description: string;
  competences?: string[];
}): CareerItem {
  return {
    id: m.id,
    slug: m.slug,
    title: m.titre,
    domain: m.domaineNom ?? m.domaineId,
    domainSlug: m.domaineId,
    summary: m.description,
    description: m.description,
    videoLength: "45s",
    riasec: (m.competences ?? []) as RiasecType[],
  };
}

export default function CareersExplorerPage() {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";

  const [mode, setMode] = useState<Mode>("fiche");
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [query, setQuery] = useState(urlQuery);
  const [suggestOpen, setSuggestOpen] = useState(false);

  const [careers, setCareers] = useState<CareerItem[]>(
    CAREERS.map((c) => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      domain: c.domain,
      domainSlug: c.domain,
      summary: c.summary,
      description: c.description,
      videoLength: c.videoLength,
      riasec: c.riasec,
    })),
  );
  const [domains, setDomains] = useState(DOMAINS);
  const [domainCareers, setDomainCareers] = useState<CareerItem[]>([]);

  // Reste synchro si le paramètre ?q= change (ex: recherche depuis la TopBar)
  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const data = await fetchPublicDomaines();
        if (!active || !data.length) return;
        setDomains(
          data.map((d) => ({
            slug: d.id,
            name: d.nom,
            description: d.description ?? "",
            icon: DOMAINS.find((x) => x.slug === d.id)?.icon ?? "compass",
          })),
        );
        const all = await fetchPublicMetiers();
        if (active && all.length) {
          setCareers(all.map(mapApiCareer));
        }
      } catch {
        // static fallback
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedDomain) {
      setDomainCareers([]);
      return;
    }
    let active = true;
    async function loadDomain() {
      try {
        const data = await fetchPublicMetiers({ domaineId: selectedDomain! });
        if (active) setDomainCareers(data.map(mapApiCareer));
      } catch {
        if (active) {
          setDomainCareers(
            careersInDomain(selectedDomain!).map((c) => ({
              id: c.id,
              slug: c.slug,
              title: c.title,
              domain: c.domain,
              domainSlug: c.domain,
              summary: c.summary,
              description: c.description,
              videoLength: c.videoLength,
              riasec: c.riasec,
            })),
          );
        }
      }
    }
    loadDomain();
    return () => {
      active = false;
    };
  }, [selectedDomain]);

  const domain = domains.find((d) => d.slug === selectedDomain);

  const domainCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const d of domains) {
      counts[d.slug] = careers.filter((c) => c.domainSlug === d.slug).length;
    }
    return counts;
  }, [domains, careers]);

  // Recherche globale de métiers (nom du métier ou du domaine)
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return careers.filter(
      (c) => c.title.toLowerCase().includes(q) || c.domain.toLowerCase().includes(q),
    );
  }, [query, careers]);

  const isSearching = query.trim().length > 0;

  const filteredDomains = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return domains;
    return domains.filter((d) => d.name.toLowerCase().includes(q));
  }, [query, domains]);

  const visibleCareers = selectedDomain
    ? domainCareers.length
      ? domainCareers
      : careers.filter((c) => c.domainSlug === selectedDomain)
    : [];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-teal-950">Explorer les métiers</h1>
      <p className="mt-1 text-sm text-slate">
        Découvre librement le catalogue de métiers présenté aux élèves sur To be.come.
      </p>

      <div className="mt-5 inline-flex rounded-full border border-line bg-white p-1">
        <button
          onClick={() => setMode("fiche")}
          className={`focus-ring inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            mode === "fiche" ? "bg-teal-700 text-white" : "text-ink hover:bg-teal-50"
          }`}
        >
          <LayoutGrid size={15} /> Fiche métier
        </button>
        <button
          onClick={() => setMode("video")}
          className={`focus-ring inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            mode === "video" ? "bg-teal-700 text-white" : "text-ink hover:bg-teal-50"
          }`}
        >
          <Video size={15} /> Vidéo
        </button>
      </div>

      {mode === "video" ? (
        <div className="mt-6">
          <VideoFeed careers={careers} />
        </div>
      ) : selectedDomain ? (
        <div className="mt-6">
          <button
            onClick={() => setSelectedDomain(null)}
            className="focus-ring mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 hover:underline"
          >
            <ArrowLeft size={16} /> Retour aux domaines
          </button>

          {domain && (
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
                {(() => {
                  const Icon = getIcon(domain.icon);
                  return <Icon size={20} />;
                })()}
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-teal-950">{domain.name}</h2>
                <p className="text-sm text-slate">{domain.description}</p>
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {visibleCareers.map((career) => (
              <Link key={career.id} href={`/parent/metiers/${career.slug}`} className="focus-ring block">
                <Card className="h-full p-5 transition-shadow hover:shadow-md">
                  <div className="mb-2 flex items-center justify-between">
                    <Pill tone="slate">{career.domain}</Pill>
                    <span className="text-xs text-slate">{career.videoLength}</span>
                  </div>
                  <h3 className="font-display font-semibold text-teal-950">{career.title}</h3>
                  <p className="mt-1 text-sm text-slate">{career.summary}</p>
                  <div className="mt-3 flex gap-1.5">
                    {career.riasec.map((t) => (
                      <Pill key={t} tone="teal">
                        {RIASEC_LABELS[t]}
                      </Pill>
                    ))}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-6">
          {isSearching ? (
            searchResults.length > 0 ? (
              <div className="mt-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate">
                  {searchResults.length} métier{searchResults.length > 1 ? "s" : ""} trouvé
                  {searchResults.length > 1 ? "s" : ""}
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {searchResults.map((career) => (
                    <Link key={career.id} href={`/parent/metiers/${career.slug}`} className="focus-ring block">
                      <Card className="h-full p-5 transition-shadow hover:shadow-md">
                        <div className="mb-2 flex items-center justify-between">
                          <Pill tone="slate">{career.domain}</Pill>
                          <span className="text-xs text-slate">{career.videoLength}</span>
                        </div>
                        <h3 className="font-display font-semibold text-teal-950">{career.title}</h3>
                        <p className="mt-1 text-sm text-slate">{career.summary}</p>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mx-auto mt-8 max-w-md">
                <EmptyState
                  title="Aucun métier trouvé"
                  description={`Nous n'avons pas encore "${query}" dans notre catalogue.`}
                  action={
                    <button
                      onClick={() => setSuggestOpen(true)}
                      className="focus-ring inline-flex items-center gap-2 rounded-full bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
                    >
                      <Lightbulb size={16} />
                      Proposer ce métier
                    </button>
                  }
                />
              </div>
            )
          ) : (
            <div className="mt-6">
              <DomainCarousel
                domains={filteredDomains}
                countBySlug={domainCounts}
                onSelect={(slug) => setSelectedDomain(slug)}
              />
            </div>
          )}
        </div>
      )}

      <SuggestMetierDialog
        open={suggestOpen}
        initialQuery={query}
        onClose={() => setSuggestOpen(false)}
      />
    </div>
  );
}