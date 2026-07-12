import type { Metier } from "./metiers";

/**
 * Images d'illustration des métiers (Unsplash, URLs stables).
 * Chaque fiche utilise l'image propre au métier si le champ `image` est
 * rempli dans metiers.ts ; sinon, l'image de son domaine ci-dessous.
 * Remplace librement ces URLs par tes propres visuels.
 */
export const IMAGES_DOMAINES: Record<string, string> = {
  "Numérique": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=60&auto=format&fit=crop",
  "Infrastructure Informatique": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=60&auto=format&fit=crop",
  "Intelligence Artificielle": "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=60&auto=format&fit=crop",
  "Data": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=60&auto=format&fit=crop",
  "Design Numérique": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=60&auto=format&fit=crop",
  "Création Numérique": "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1200&q=60&auto=format&fit=crop",
  "Marketing Digital": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=60&auto=format&fit=crop",
  "Gestion de Produit": "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=60&auto=format&fit=crop",
  "Gestion de Projet": "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&q=60&auto=format&fit=crop",
  "Développement Commercial": "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&q=60&auto=format&fit=crop",
  "Entrepreneuriat": "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&q=60&auto=format&fit=crop",
  "Cybersécurité": "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&q=60&auto=format&fit=crop",
};

const IMAGE_PAR_DEFAUT =
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=60&auto=format&fit=crop";

/** Image d'un métier : la sienne si renseignée, sinon celle de son domaine. */
export function getMetierImage(metier: Pick<Metier, "image" | "domaine">): string {
  return metier.image || IMAGES_DOMAINES[metier.domaine] || IMAGE_PAR_DEFAUT;
}
