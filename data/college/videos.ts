/**
 * 📍 DÉPOSE TES LIENS VIDÉOS ICI 📍
 * -------------------------------------------------
 * Utilisé par : app/college/explorer/videos/page.tsx
 *
 * - url : lien direct vers le fichier vidéo (.mp4) OU un id/embed (YouTube, Mux, Cloudflare Stream...)
 * - poster : image affichée avant lecture (utile pendant le chargement)
 * - metierSlug : doit correspondre à un "slug" présent dans metiers.ts,
 *   pour pouvoir relier une vidéo à sa fiche métier détaillée.
 */

export type CollegeVideo = {
  id: string;
  url: string;          // 👉 mets ton lien vidéo ici
  poster?: string;       // 👉 mets ton image de couverture ici
  metierSlug: string;    // doit exister dans metiers.ts
  titre: string;
  domaine?: string;
  extraitTemoignage?: string;
};

export const videos: CollegeVideo[] = [
  {
    id: "video-001",
    url: "https://jxvdljnktsvgbgzhqoka.supabase.co/storage/v1/object/sign/video/Expert%20IA.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xNmIyNWE2OS0xNDIxLTQ5ZWUtYjgwZi1jYTVmZWZiZDQxNzEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2aWRlby9FeHBlcnQgSUEubXA0Iiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4MzM0NjMxMSwiZXhwIjoxODE0ODgyMzExfQ.rUgf1KUGe-1-GYCoFGnrktdEGFNnlJa20YRc6icdSOE",           // TODO: lien vidéo métier 1
    poster: "",        // TODO: image de couverture
    metierSlug: "expert-ia",
    titre: "Conçoit et déploie des solutions basées sur l'intelligence artificielle pour automatiser et améliorer les processus.",
    extraitTemoignage: "",
  },
  {
    id: "video-002",
    url: "https://jxvdljnktsvgbgzhqoka.supabase.co/storage/v1/object/sign/video/Prompt%20engineer.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xNmIyNWE2OS0xNDIxLTQ5ZWUtYjgwZi1jYTVmZWZiZDQxNzEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2aWRlby9Qcm9tcHQgZW5naW5lZXIubXA0Iiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4MzM0NjQwMiwiZXhwIjoxODE0ODgyNDAyfQ.E6s2SUhiF_MOIlmaNwOofvY1k3cAZ7map7aewPb_gw0",           // TODO: lien vidéo métier 2
    poster: "",
    metierSlug: "prompt-engineer",
    titre: "Rédige et optimise les instructions destinées aux intelligences artificielles afin d'obtenir les meilleurs résultats.",
    extraitTemoignage: "",
  },
  {
    id: "video-003",
    url: "https://jxvdljnktsvgbgzhqoka.supabase.co/storage/v1/object/sign/video/Data%20Scientist.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xNmIyNWE2OS0xNDIxLTQ5ZWUtYjgwZi1jYTVmZWZiZDQxNzEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2aWRlby9EYXRhIFNjaWVudGlzdC5tcDQiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzgzMzQ2MTkyLCJleHAiOjE4MTQ4ODIxOTJ9.8Fv6h09q3dv6afqdDG8B4b9-jrfrUdND_VAAKMq6JIQ",           // TODO: lien vidéo métier 3
    poster: "",
    metierSlug: "data-scientist",
    titre: "Analyse de grandes quantités de données pour créer des modèles prédictifs et aider à la prise de décision.",
    extraitTemoignage: "",
  },
  // 👉 Ajoute autant d'objets que nécessaire, le flux défile à l'infini (voir VideoFeed.tsx).
  {
    id: "video-004",
    url: "https://jxvdljnktsvgbgzhqoka.supabase.co/storage/v1/object/sign/video/UI%20Designer.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xNmIyNWE2OS0xNDIxLTQ5ZWUtYjgwZi1jYTVmZWZiZDQxNzEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2aWRlby9VSSBEZXNpZ25lci5tcDQiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzgzMzQ2NDE5LCJleHAiOjE4MTQ4ODI0MTl9.eQo9xaRM4g_89oGpCYsql1GBks3KXXrUxfBni-KAZJA",           // TODO: lien vidéo métier 3
    poster: "",
    metierSlug: "ui-designer",
    titre: "Conçoit des interfaces esthétiques, intuitives et adaptées aux besoins des utilisateurs",
    extraitTemoignage: "",
  },
    {
    id: "video-005",
    url: "https://jxvdljnktsvgbgzhqoka.supabase.co/storage/v1/object/sign/video/UX%20Designer.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xNmIyNWE2OS0xNDIxLTQ5ZWUtYjgwZi1jYTVmZWZiZDQxNzEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2aWRlby9VWCBEZXNpZ25lci5tcDQiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzgzMzQ2NDgzLCJleHAiOjE4MTQ4ODI0ODN9.6Li20JWXO7SqkvR5JdpV3Zqsn3Oh0qpMy2Jz0U6u3H4",           // TODO: lien vidéo métier 3
    poster: "",
    metierSlug: "ux-designer",
    titre: "Étudie le comportement des utilisateurs afin de créer une expérience simple, agréable et efficace.",
    extraitTemoignage: "",
  },


  {
    id: "video-006",
    url: "https://jxvdljnktsvgbgzhqoka.supabase.co/storage/v1/object/sign/video/Graphiste%20digital.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xNmIyNWE2OS0xNDIxLTQ5ZWUtYjgwZi1jYTVmZWZiZDQxNzEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2aWRlby9HcmFwaGlzdGUgZGlnaXRhbC5tcDQiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzgzMzQ2MzI5LCJleHAiOjE4MTQ4ODIzMjl9.gaSKXgSKEeNET18O_WpkTyIKQr60UT-fC_yqc_k5IMQ",           // TODO: lien vidéo métier 3
    poster: "",
    metierSlug: "graphiste-digital",
    titre: "Crée des visuels numériques destinés aux sites web, applications, publicités et réseaux sociaux.",
    extraitTemoignage: "",
  },

  {
    id: "video-007",
    url: "https://jxvdljnktsvgbgzhqoka.supabase.co/storage/v1/object/sign/video/Community%20manager.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xNmIyNWE2OS0xNDIxLTQ5ZWUtYjgwZi1jYTVmZWZiZDQxNzEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2aWRlby9Db21tdW5pdHkgbWFuYWdlci5tcDQiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzgzMzQ2MDc0LCJleHAiOjE4MTQ4ODIwNzR9.Eo-bpAKfHQEFvU6zpoyZrzfJT9PuK37MulmTCaZQhgU",           // TODO: lien vidéo métier 3
    poster: "",
    metierSlug: "community-manager",
    titre: "Anime les communautés sur les réseaux sociaux, crée du contenu et renforce l'image d'une marque.",
    extraitTemoignage: "",
  },

  {
    id: "video-008",
    url: "https://jxvdljnktsvgbgzhqoka.supabase.co/storage/v1/object/sign/video/Content%20creator.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xNmIyNWE2OS0xNDIxLTQ5ZWUtYjgwZi1jYTVmZWZiZDQxNzEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2aWRlby9Db250ZW50IGNyZWF0b3IubXA0Iiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4MzM0NjE0MSwiZXhwIjoxODE0ODgyMTQxfQ.e_IT7JNUL5SsSFXlo-2rZKvaBgebWA5x5J0hgPVqIlw",           // TODO: lien vidéo métier 3
    poster: "",
    metierSlug: "content-creator",
    titre: "Produit des vidéos, articles, podcasts ou publications destinés aux plateformes numériques.",
    extraitTemoignage: "",
  },

  {
    id: "video-009",
    url: "https://jxvdljnktsvgbgzhqoka.supabase.co/storage/v1/object/sign/video/Email%20marketeur.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xNmIyNWE2OS0xNDIxLTQ5ZWUtYjgwZi1jYTVmZWZiZDQxNzEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2aWRlby9FbWFpbCBtYXJrZXRldXIubXA0Iiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4MzM0NjI2MywiZXhwIjoxODE0ODgyMjYzfQ.V9kimgcAcWPn2ExlbNaIGDK6K4VYM8oUqpR4PgsMo58",           // TODO: lien vidéo métier 3
    poster: "",
    metierSlug: "email-marketeur",
    titre: "Conçoit des campagnes d'emailing pour fidéliser les clients et développer les ventes.",
    extraitTemoignage: "",
  },

  {
    id: "video-010",
    url: "https://jxvdljnktsvgbgzhqoka.supabase.co/storage/v1/object/sign/video/Growth%20Hacker.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xNmIyNWE2OS0xNDIxLTQ5ZWUtYjgwZi1jYTVmZWZiZDQxNzEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2aWRlby9Hcm93dGggSGFja2VyLm1wNCIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODMzNDYzNTQsImV4cCI6MTgxNDg4MjM1NH0.ikK0Lp7aL5BQaCzcQFKW7Z47HnuTBTjuLwYWqN7MzrY",           // TODO: lien vidéo métier 3
    poster: "",
    metierSlug: "growth-hacker",
    titre: "Utilise des techniques créatives et des analyses de données pour accélérer la croissance d'une entreprise.",
    extraitTemoignage: "",
  },


  {
    id: "video-011",
    url: "https://jxvdljnktsvgbgzhqoka.supabase.co/storage/v1/object/sign/video/Product%20manager.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xNmIyNWE2OS0xNDIxLTQ5ZWUtYjgwZi1jYTVmZWZiZDQxNzEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2aWRlby9Qcm9kdWN0IG1hbmFnZXIubXA0Iiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4MzM0NjM4MiwiZXhwIjoxODE0ODgyMzgyfQ.Ddi4jWbfH0f9u-r41-07wIVVd_hQzOh1ZQiodx9Fo0Y",           // TODO: lien vidéo métier 3
    poster: "",
    metierSlug: "product-manager",
    titre: "Définit la vision d'un produit numérique et coordonne les équipes pour répondre aux besoins des utilisateurs.",
    extraitTemoignage: "",
  },


  {
    id: "video-012",
    url: "https://jxvdljnktsvgbgzhqoka.supabase.co/storage/v1/object/sign/video/Business%20Developper.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xNmIyNWE2OS0xNDIxLTQ5ZWUtYjgwZi1jYTVmZWZiZDQxNzEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2aWRlby9CdXNpbmVzcyBEZXZlbG9wcGVyLm1wNCIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODMzNDYwNDYsImV4cCI6MTgxNDg4MjA0Nn0.3a1pFbMSwqE-9fBMHu_VILQecCs9AejfvQ_13e8W15g",           // TODO: lien vidéo métier 3
    poster: "",
    metierSlug: "business-developer",
    titre: "Développe les opportunités commerciales, trouve de nouveaux clients et crée des partenariats stratégiques.",
    extraitTemoignage: "",
  },


  {
    id: "video-013",
    url: "https://jxvdljnktsvgbgzhqoka.supabase.co/storage/v1/object/sign/video/Entrepreneur%20Digital.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xNmIyNWE2OS0xNDIxLTQ5ZWUtYjgwZi1jYTVmZWZiZDQxNzEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2aWRlby9FbnRyZXByZW5ldXIgRGlnaXRhbC5tcDQiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzgzMzQ2Mjg1LCJleHAiOjE4MTQ4ODIyODV9.cMuRE7sURx9jnSQ3APXAvf31VJj4sNbhKrN6sZgR0qc",           // TODO: lien vidéo métier 3
    poster: "",
    metierSlug: "entrepreneur-digital",
    titre: "Crée et développe une entreprise basée sur des produits ou services numériques innovants.",
    extraitTemoignage: "",
  },


  {
    id: "video-014",
    url: "https://jxvdljnktsvgbgzhqoka.supabase.co/storage/v1/object/sign/video/Dev%20ops.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xNmIyNWE2OS0xNDIxLTQ5ZWUtYjgwZi1jYTVmZWZiZDQxNzEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2aWRlby9EZXYgb3BzLm1wNCIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODMzNDYyMjIsImV4cCI6MTgxNDg4MjIyMn0.M_6J-v2A0DQ8L3yWZZr_MFjNRN9GSphy00Til64SSzU",           // TODO: lien vidéo métier 3
    poster: "",
    metierSlug: "devops",
    titre: "Automatise le déploiement et la gestion des applications afin d'améliorer leur fiabilité et leur rapidité.",
    extraitTemoignage: "",
  },


  {
    id: "video-015",
    url: "https://jxvdljnktsvgbgzhqoka.supabase.co/storage/v1/object/sign/video/Cybersecurite.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xNmIyNWE2OS0xNDIxLTQ5ZWUtYjgwZi1jYTVmZWZiZDQxNzEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2aWRlby9DeWJlcnNlY3VyaXRlLm1wNCIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODMzNDYxNjgsImV4cCI6MTgxNDg4MjE2OH0.jlD7KmPtIdOHfAsdFe4l6eSEJLTP8FJxUsJckgpPI5s",           // TODO: lien vidéo métier 3
    poster: "",
    metierSlug: "cybersecurite",
    titre: "Protège les systèmes informatiques, les réseaux et les données contre les cyberattaques et les menaces.",
    extraitTemoignage: "",
  },

  {
    id: "video-016",
    url: "https://jxvdljnktsvgbgzhqoka.supabase.co/storage/v1/object/sign/video/Chef%20de%20projet%20SI.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xNmIyNWE2OS0xNDIxLTQ5ZWUtYjgwZi1jYTVmZWZiZDQxNzEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2aWRlby9DaGVmIGRlIHByb2pldCBTSS5tcDQiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzgzMzQ1NTEyLCJleHAiOjE4MTQ4ODE1MTJ9.qcwvUDi48OATKuPMAAIk82F4xbKK0WnxUStD-5RhyC8",
    poster: "",
    metierSlug: "chef-de-projet-digital",
    titre: "Planifie, organise et supervise les projets numériques en coordonnant les équipes.",
    extraitTemoignage: "",
  },

];
