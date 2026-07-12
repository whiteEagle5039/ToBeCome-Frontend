// lib/metiers-data.ts
// Source de données pour la page "Métiers".
// -> Pour ajouter un domaine ou un métier, complète simplement les tableaux ci-dessous.
// -> "image" attend un chemin vers /public (ex: "/images/domaines/sante.jpg").
//    Tant que tu n'as pas d'image réelle, laisse vide : une icône + couleur de secours s'affiche.

import type { LucideIcon } from "lucide-react";
import {
  HeartPulse,
  Cpu,
  HardHat,
  GraduationCap,
  Store,
  Hammer,
  Scale,
  Leaf,
} from "lucide-react";

export type Domaine = {
  id: string;
  nom: string;
  description: string;
  image?: string;
  icon: LucideIcon;
  couleur: string; // classes tailwind pour le dégradé (utilisé sur les cartes métier)
  gradFrom: string; // couleur hex pour le dégradé SVG de la carte "dossier"
  gradTo: string; // couleur hex pour le dégradé SVG de la carte "dossier"
};

export type Metier = {
  id: string;
  domaineId: string;
  titre: string;
  image?: string;
  description: string; // courte description (carte)
  ceQuIlFait: string; // description longue (fiche)
  tachesQuotidiennes: string[];
  competences: string[];
};

export const domaines: Domaine[] = [
  {
    id: "sante",
    nom: "Santé",
    description: "Soigner, accompagner et prévenir.",
    icon: HeartPulse,
    couleur: "from-rose-500 to-orange-400",
    gradFrom: "#fb7185",
    gradTo: "#fb923c",
  },
  {
    id: "numerique",
    nom: "Numérique & Tech",
    description: "Concevoir, coder et connecter.",
    icon: Cpu,
    couleur: "from-indigo-500 to-sky-400",
    gradFrom: "#818cf8",
    gradTo: "#38bdf8",
  },
  {
    id: "batiment",
    nom: "Bâtiment & Construction",
    description: "Bâtir, aménager et entretenir.",
    icon: HardHat,
    couleur: "from-amber-500 to-yellow-400",
    gradFrom: "#f59e0b",
    gradTo: "#facc15",
  },
  {
    id: "education",
    nom: "Éducation & Formation",
    description: "Transmettre et faire grandir.",
    icon: GraduationCap,
    couleur: "from-emerald-500 to-teal-400",
    gradFrom: "#10b981",
    gradTo: "#2dd4bf",
  },
  {
    id: "commerce",
    nom: "Commerce & Vente",
    description: "Vendre, négocier et satisfaire.",
    icon: Store,
    couleur: "from-fuchsia-500 to-pink-400",
    gradFrom: "#d946ef",
    gradTo: "#f472b6",
  },
  {
    id: "artisanat",
    nom: "Artisanat",
    description: "Créer et fabriquer avec les mains.",
    icon: Hammer,
    couleur: "from-stone-500 to-neutral-400",
    gradFrom: "#78716c",
    gradTo: "#a3a3a3",
  },
  {
    id: "droit",
    nom: "Droit & Justice",
    description: "Défendre, conseiller et arbitrer.",
    icon: Scale,
    couleur: "from-slate-600 to-slate-400",
    gradFrom: "#475569",
    gradTo: "#94a3b8",
  },
  {
    id: "agriculture",
    nom: "Agriculture & Environnement",
    description: "Cultiver, élever et préserver.",
    icon: Leaf,
    couleur: "from-lime-500 to-green-400",
    gradFrom: "#84cc16",
    gradTo: "#4ade80",
  },
];

export const metiers: Metier[] = [
  {
    id: "infirmier",
    domaineId: "sante",
    titre: "Infirmier / Infirmière",
    description: "Assure les soins et le suivi des patients.",
    ceQuIlFait:
      "L'infirmier prend en charge les patients au quotidien : il administre les traitements prescrits, surveille l'évolution de leur état de santé et assure le lien entre le patient, la famille et le médecin.",
    tachesQuotidiennes: [
      "Prendre les constantes (tension, température, pouls)",
      "Administrer les médicaments et les soins prescrits",
      "Tenir le dossier médical à jour",
      "Rassurer et informer les patients et leurs proches",
    ],
    competences: [
      "Rigueur et sens de l'observation",
      "Gestes techniques (perfusion, pansements...)",
      "Empathie et écoute",
      "Résistance au stress",
    ],
  },
  {
    id: "developpeur-web",
    domaineId: "numerique",
    titre: "Développeur / Développeuse Web",
    description: "Conçoit et construit des sites et applications.",
    ceQuIlFait:
      "Le développeur web transforme un besoin en application fonctionnelle : il écrit le code, teste les fonctionnalités et fait évoluer le produit avec l'équipe technique.",
    tachesQuotidiennes: [
      "Écrire et tester du code",
      "Corriger des bugs signalés",
      "Participer aux réunions d'équipe",
      "Documenter le travail réalisé",
    ],
    competences: [
      "Logique de programmation",
      "Maîtrise d'un ou plusieurs langages (JS, Python...)",
      "Autonomie et curiosité technique",
      "Travail en équipe",
    ],
  },
  {
    id: "macon",
    domaineId: "batiment",
    titre: "Maçon / Maçonne",
    description: "Construit et rénove les structures d'un bâtiment.",
    ceQuIlFait:
      "Le maçon réalise les fondations, monte les murs et coule les dalles en respectant les plans fournis par l'architecte ou le chef de chantier.",
    tachesQuotidiennes: [
      "Préparer le mortier et les matériaux",
      "Monter murs, cloisons et fondations",
      "Lire et suivre un plan de construction",
      "Respecter les règles de sécurité du chantier",
    ],
    competences: [
      "Force physique et endurance",
      "Précision et sens de la mesure",
      "Lecture de plans",
      "Travail en équipe",
    ],
  },
  {
    id: "enseignant",
    domaineId: "education",
    titre: "Enseignant / Enseignante",
    description: "Transmet des savoirs et accompagne les élèves.",
    ceQuIlFait:
      "L'enseignant prépare et anime ses cours, évalue les élèves et adapte sa pédagogie pour que chacun progresse à son rythme.",
    tachesQuotidiennes: [
      "Préparer les cours et supports pédagogiques",
      "Animer la classe",
      "Corriger les devoirs et évaluations",
      "Échanger avec les parents sur le suivi de l'élève",
    ],
    competences: [
      "Pédagogie et patience",
      "Maîtrise de la matière enseignée",
      "Communication",
      "Gestion de groupe",
    ],
  },
  {
    id: "commercial",
    domaineId: "commerce",
    titre: "Commercial / Commerciale",
    description: "Développe les ventes et fidélise les clients.",
    ceQuIlFait:
      "Le commercial identifie des prospects, présente les produits ou services de l'entreprise et négocie les contrats pour atteindre ses objectifs de vente.",
    tachesQuotidiennes: [
      "Prospecter de nouveaux clients",
      "Présenter et argumenter une offre",
      "Négocier les conditions de vente",
      "Suivre la satisfaction client",
    ],
    competences: [
      "Aisance relationnelle",
      "Sens de la négociation",
      "Persévérance",
      "Organisation",
    ],
  },
  {
    id: "couturier",
    domaineId: "artisanat",
    titre: "Couturier / Couturière",
    description: "Crée et confectionne des vêtements sur mesure.",
    ceQuIlFait:
      "Le couturier prend les mesures du client, choisit les tissus adaptés et confectionne le vêtement, de la coupe jusqu'à la finition.",
    tachesQuotidiennes: [
      "Prendre les mesures et conseiller le client",
      "Couper le tissu selon le patron",
      "Coudre et assembler les pièces",
      "Réaliser les finitions et essayages",
    ],
    competences: [
      "Dextérité manuelle",
      "Sens de la mode et de l'esthétique",
      "Précision",
      "Patience",
    ],
  },
];

export function getMetierById(id: string): Metier | undefined {
  return metiers.find((m) => m.id === id)
}

export function getMetiersByDomaine(domaineId: string): Metier[] {
  return metiers.filter((m) => m.domaineId === domaineId);
}

export function getDomaineById(domaineId: string): Domaine | undefined {
  return domaines.find((d) => d.id === domaineId);
}

export function searchMetiers(query: string): Metier[] {
  const q = query.trim().toLowerCase();
  if (!q) return metiers;
  return metiers.filter(
    (m) =>
      m.titre.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q)
  );
}