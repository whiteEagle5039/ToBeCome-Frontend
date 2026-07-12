import { CAREERS, DOMAINS } from "./mockData";

export function getCareer(id: string) {
  return CAREERS.find((c) => c.id === id);
}

export function getCareerBySlug(slug: string) {
  return CAREERS.find((c) => c.slug === slug);
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getDomain(slug: string) {
  return DOMAINS.find((d) => d.slug === slug);
}

export function careersInDomain(domainSlug: string) {
  return CAREERS.filter((c) => slugify(c.domain) === domainSlug);
}

export function normalizeName(value: string) {
  return value
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long", year: "numeric" }).format(
    new Date(iso)
  );
}

export function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function age(birthDateIso: string) {
  const b = new Date(birthDateIso);
  const now = new Date();
  let a = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) a--;
  return a;
}
