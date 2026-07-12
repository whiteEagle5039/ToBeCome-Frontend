// lib/etablissements-data.ts
// Source de données pour le catalogue des établissements abonnés.
// -> "image" attend un chemin vers /public ou une URL (ex: "/images/etablissements/xyz.jpg").
//    Sans image, un monogramme doré/teal s'affiche automatiquement.
// -> "siteUrl" est le lien vers le site généré par le système pour cet établissement.

export type Etablissement = {
  id: string;
  nom: string;
  type: string; // "Lycée", "Université", "Institut technique", "École primaire"...
  ville: string;
  image?: string;
  siteUrl: string;
};

export const etablissements: Etablissement[] = [
  {
    id: "lycee-victor-hugo",
    nom: "Lycée Victor Hugo",
    type: "Lycée général",
    ville: "Cotonou",
    siteUrl: "https://lycee-victor-hugo.example.com",
  },
  {
    id: "college-saint-michel",
    nom: "Collège Saint-Michel",
    type: "Collège privé",
    ville: "Porto-Novo",
    siteUrl: "https://college-saint-michel.example.com",
  },
  {
    id: "universite-des-sciences",
    nom: "Université des Sciences et Technologies",
    type: "Université",
    ville: "Abomey-Calavi",
    siteUrl: "https://ust.example.com",
  },
  {
    id: "institut-technique-nord",
    nom: "Institut Technique du Nord",
    type: "Institut technique",
    ville: "Parakou",
    siteUrl: "https://itn.example.com",
  },
  {
    id: "ecole-primaire-les-cocotiers",
    nom: "École Primaire Les Cocotiers",
    type: "École primaire",
    ville: "Ouidah",
    siteUrl: "https://ep-les-cocotiers.example.com",
  },
  {
    id: "lycee-technique-jean-piaget",
    nom: "Lycée Technique Jean Piaget",
    type: "Lycée technique",
    ville: "Cotonou",
    siteUrl: "https://ltjp.example.com",
  },
];

export function getInitials(nom: string): string {
  return nom
    .split(" ")
    .filter((w) => w.length > 2 || /^[A-ZÀ-Ý]/.test(w))
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}