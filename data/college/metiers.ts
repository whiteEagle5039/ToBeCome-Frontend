/**
 * 📍 DÉPOSE TES FICHES MÉTIERS ICI 📍
 * -------------------------------------------------
 * Utilisé par :
 *  - app/college/explorer/fiches/[matiere]/page.tsx (liste par matière)
 *  - app/college/explorer/fiches/[matiere]/[metier]/page.tsx (fiche détaillée)
 *  - app/college/quetes/[matiere]/page.tsx (métiers débloqués en quête)
 *
 * Chaque métier suit exactement le format de la maquette "fiche métier" :
 * image, nom, domaine d'activité, Présentation, Ce que fait le professionnel,
 * Qualités requises.
 */

export type Matiere =
  | "mathematiques"
  | "francais"
  | "svt"
  | "physique-chimie"
  | "histoire-geo"
  | "anglais"
  | "arts-plastiques"
  | "eps";

export type Metier = {
  slug: string;                 // identifiant url-friendly, ex: "developpeur-web"
  nom: string;
  domaine: string;               // ex: "Numérique", "Santé", "Construction"
  image: string;                 // 👉 mets ton image ici (grande image en haut de la fiche)
  descriptionCourte: string;      // utilisée sur les cartes (liste métiers, carrousels)
  matieres: Matiere[];            // une ou plusieurs matières associées

  // Contenu de la fiche détaillée
  presentation: string;
  activites: string[];            // "Ce que fait le professionnel" (liste à puces)
  qualitesRequises: string[];      // "Qualités requises"
};

export const metiers: Metier[] = 
[
  {
    slug: "developpeur-web",
    nom: "Développeur Web",
    domaine: "Numérique",
    image: "",
    descriptionCourte:
      "Il crée des sites internet et des applications web utilisés chaque jour par des millions de personnes.",
    matieres: ["mathematiques", "anglais"],
    presentation:
      "Le développeur web conçoit et réalise des sites internet, des plateformes et des applications accessibles depuis un navigateur. Il transforme les maquettes en interfaces interactives et développe les fonctionnalités qui permettent aux utilisateurs de naviguer, d'effectuer des achats, de communiquer ou d'accéder à des services en ligne.",
    activites: [
      "Développer des sites et applications web",
      "Écrire et maintenir du code",
      "Tester les fonctionnalités avant leur mise en ligne",
      "Corriger les bugs et améliorer les performances",
    ],
    qualitesRequises: [
      "Logique",
      "Curiosité",
      "Patience",
      "Esprit d'équipe",
    ],
  },

  {
    slug: "developpeur-mobile",
    nom: "Développeur Mobile",
    domaine: "Numérique",
    image: "",
    descriptionCourte:
      "Il développe les applications utilisées sur smartphones et tablettes.",
    matieres: ["mathematiques", "anglais"],
    presentation:
      "Le développeur mobile crée des applications pour Android et iPhone. Il imagine des interfaces simples, développe les fonctionnalités et veille à ce que l'application fonctionne parfaitement sur différents appareils.",
    activites: [
      "Créer des applications mobiles",
      "Développer de nouvelles fonctionnalités",
      "Tester les applications",
      "Publier les applications sur les stores",
    ],
    qualitesRequises: [
      "Créativité",
      "Logique",
      "Persévérance",
      "Rigueur",
    ],
  },

  {
    slug: "developpeur-back-end",
    nom: "Développeur Back-end",
    domaine: "Numérique",
    image: "",
    descriptionCourte:
      "Il développe la partie invisible des applications qui gère les données et les serveurs.",
    matieres: ["mathematiques", "physique-chimie"],
    presentation:
      "Le développeur back-end construit les services qui permettent aux applications de fonctionner. Il développe les bases de données, les serveurs et les API utilisées par les applications web et mobiles.",
    activites: [
      "Créer les API",
      "Gérer les bases de données",
      "Sécuriser les données",
      "Optimiser les performances des serveurs",
    ],
    qualitesRequises: [
      "Analyse",
      "Logique",
      "Organisation",
      "Rigueur",
    ],
  },

  {
    slug: "developpeur-no-code",
    nom: "Développeur No-code",
    domaine: "Numérique",
    image: "",
    descriptionCourte:
      "Il crée des applications sans écrire beaucoup de code grâce à des outils spécialisés.",
    matieres: ["mathematiques"],
    presentation:
      "Le développeur no-code utilise des plateformes visuelles pour créer rapidement des sites, des applications et des automatisations. Il permet aux entreprises de lancer des projets en peu de temps.",
    activites: [
      "Créer des applications avec des outils no-code",
      "Automatiser des tâches",
      "Configurer des bases de données",
      "Former les utilisateurs",
    ],
    qualitesRequises: [
      "Créativité",
      "Organisation",
      "Autonomie",
      "Curiosité",
    ],
  },

  {
    slug: "expert-ia",
    nom: "Expert IA",
    domaine: "Intelligence Artificielle",
    image: "",
    descriptionCourte:
      "Il développe des solutions utilisant l'intelligence artificielle pour résoudre des problèmes complexes.",
    matieres: ["mathematiques", "physique-chimie"],
    presentation:
      "L'expert en intelligence artificielle conçoit des systèmes capables d'apprendre à partir de données afin d'automatiser certaines tâches ou d'aider à la prise de décision dans différents secteurs.",
    activites: [
      "Concevoir des modèles d'intelligence artificielle",
      "Analyser des données",
      "Entraîner des modèles",
      "Améliorer les performances des systèmes",
    ],
    qualitesRequises: [
      "Esprit analytique",
      "Curiosité",
      "Patience",
      "Rigueur",
    ],
  },

  {
    slug: "prompt-engineer",
    nom: "Prompt Engineer",
    domaine: "Intelligence Artificielle",
    image: "",
    descriptionCourte:
      "Il conçoit les meilleures instructions permettant aux intelligences artificielles de produire des résultats précis.",
    matieres: ["francais", "anglais"],
    presentation:
      "Le Prompt Engineer rédige, teste et améliore des instructions destinées aux intelligences artificielles génératives afin d'obtenir des réponses fiables, utiles et adaptées aux besoins des utilisateurs.",
    activites: [
      "Rédiger des prompts",
      "Tester les réponses des IA",
      "Optimiser les résultats obtenus",
      "Collaborer avec les équipes produit",
    ],
    qualitesRequises: [
      "Créativité",
      "Esprit d'analyse",
      "Excellente rédaction",
      "Curiosité",
    ],
  },

  {
    slug: "data-scientist",
    nom: "Data Scientist",
    domaine: "Data",
    image: "",
    descriptionCourte:
      "Il analyse de grandes quantités de données afin d'aider les entreprises à prendre de meilleures décisions.",
    matieres: ["mathematiques", "physique-chimie"],
    presentation:
      "Le Data Scientist collecte, traite et analyse des données afin de découvrir des tendances et de créer des modèles prédictifs utiles pour les entreprises.",
    activites: [
      "Collecter des données",
      "Créer des modèles statistiques",
      "Développer des algorithmes",
      "Présenter les résultats aux décideurs",
    ],
    qualitesRequises: [
      "Analyse",
      "Logique",
      "Rigueur",
      "Curiosité",
    ],
  },

  {
    slug: "data-analyst",
    nom: "Data Analyst",
    domaine: "Data",
    image: "",
    descriptionCourte:
      "Il transforme les données en informations utiles pour améliorer les décisions de l'entreprise.",
    matieres: ["mathematiques"],
    presentation:
      "Le Data Analyst analyse les données provenant de différentes sources afin d'identifier des tendances, mesurer les performances et produire des tableaux de bord compréhensibles.",
    activites: [
      "Analyser les données",
      "Créer des tableaux de bord",
      "Produire des rapports",
      "Proposer des recommandations",
    ],
    qualitesRequises: [
      "Organisation",
      "Esprit critique",
      "Rigueur",
      "Logique",
    ],
  },

  {
    slug: "business-intelligence",
    nom: "Business Intelligence",
    domaine: "Data",
    image: "",
    descriptionCourte:
      "Il transforme les données en tableaux de bord pour aider les entreprises à prendre de meilleures décisions.",
    matieres: ["mathematiques"],
    presentation:
      "Le spécialiste Business Intelligence collecte, organise et présente les données sous forme de graphiques et de tableaux de bord afin de faciliter la prise de décision.",
    activites: [
      "Créer des tableaux de bord",
      "Analyser les performances de l'entreprise",
      "Transformer les données en indicateurs",
      "Présenter les résultats aux décideurs",
    ],
    qualitesRequises: [
      "Esprit d'analyse",
      "Organisation",
      "Rigueur",
      "Curiosité",
    ],
  },

  {
    slug: "ui-designer",
    nom: "UI Designer",
    domaine: "Design Numérique",
    image: "",
    descriptionCourte:
      "Il crée l'apparence visuelle des applications et des sites internet.",
    matieres: ["arts-plastiques"],
    presentation:
      "Le UI Designer conçoit les couleurs, les boutons, les icônes et tous les éléments graphiques qui composent une interface numérique agréable et moderne.",
    activites: [
      "Créer des maquettes d'interfaces",
      "Choisir les couleurs et les typographies",
      "Concevoir les icônes",
      "Collaborer avec les développeurs",
    ],
    qualitesRequises: [
      "Créativité",
      "Sens du détail",
      "Observation",
      "Esprit d'équipe",
    ],
  },

  {
    slug: "ux-designer",
    nom: "UX Designer",
    domaine: "Design Numérique",
    image: "",
    descriptionCourte:
      "Il améliore l'expérience des utilisateurs sur les applications et les sites web.",
    matieres: ["arts-plastiques", "francais"],
    presentation:
      "Le UX Designer étudie les besoins des utilisateurs afin de rendre les applications simples, intuitives et agréables à utiliser.",
    activites: [
      "Observer les utilisateurs",
      "Créer des parcours utilisateurs",
      "Tester les interfaces",
      "Proposer des améliorations",
    ],
    qualitesRequises: [
      "Empathie",
      "Observation",
      "Créativité",
      "Esprit d'analyse",
    ],
  },

  {
    slug: "product-designer",
    nom: "Product Designer",
    domaine: "Design Numérique",
    image: "",
    descriptionCourte:
      "Il imagine et conçoit les produits numériques de leur idée jusqu'à leur réalisation.",
    matieres: ["arts-plastiques", "mathematiques"],
    presentation:
      "Le Product Designer participe à toutes les étapes de création d'un produit numérique en conciliant esthétique, simplicité et besoins des utilisateurs.",
    activites: [
      "Imaginer de nouvelles fonctionnalités",
      "Créer des prototypes",
      "Collaborer avec les développeurs",
      "Tester les solutions proposées",
    ],
    qualitesRequises: [
      "Créativité",
      "Organisation",
      "Curiosité",
      "Esprit d'équipe",
    ],
  },

  {
    slug: "motion-designer",
    nom: "Motion Designer",
    domaine: "Création Numérique",
    image: "",
    descriptionCourte:
      "Il crée des animations pour les vidéos, les réseaux sociaux et les applications.",
    matieres: ["arts-plastiques"],
    presentation:
      "Le Motion Designer donne vie aux images grâce à l'animation. Ses créations sont utilisées dans les publicités, les vidéos explicatives ou les interfaces numériques.",
    activites: [
      "Créer des animations",
      "Monter des vidéos",
      "Illustrer des concepts",
      "Travailler avec les équipes créatives",
    ],
    qualitesRequises: [
      "Créativité",
      "Patience",
      "Sens artistique",
      "Organisation",
    ],
  },

  {
    slug: "graphiste-digital",
    nom: "Graphiste Digital",
    domaine: "Création Numérique",
    image: "",
    descriptionCourte:
      "Il réalise les visuels utilisés sur internet, les réseaux sociaux et les supports numériques.",
    matieres: ["arts-plastiques"],
    presentation:
      "Le Graphiste Digital conçoit des affiches, des logos, des bannières, des illustrations et d'autres contenus visuels destinés aux supports numériques.",
    activites: [
      "Créer des visuels",
      "Concevoir des logos",
      "Réaliser des affiches numériques",
      "Préparer des contenus pour le web",
    ],
    qualitesRequises: [
      "Créativité",
      "Sens artistique",
      "Précision",
      "Observation",
    ],
  },

  {
    slug: "community-manager",
    nom: "Community Manager",
    domaine: "Marketing Digital",
    image: "",
    descriptionCourte:
      "Il anime les réseaux sociaux et échange avec la communauté d'une entreprise.",
    matieres: ["francais", "anglais"],
    presentation:
      "Le Community Manager publie des contenus, répond aux commentaires et développe la présence d'une marque sur les réseaux sociaux.",
    activites: [
      "Publier des contenus",
      "Répondre aux messages",
      "Animer les réseaux sociaux",
      "Suivre les statistiques",
    ],
    qualitesRequises: [
      "Communication",
      "Créativité",
      "Organisation",
      "Réactivité",
    ],
  },

  {
    slug: "content-creator",
    nom: "Content Creator",
    domaine: "Marketing Digital",
    image: "",
    descriptionCourte:
      "Il crée des vidéos, des photos, des articles et d'autres contenus pour internet.",
    matieres: ["francais", "arts-plastiques"],
    presentation:
      "Le Content Creator imagine et réalise des contenus destinés aux réseaux sociaux, aux sites web ou aux plateformes vidéo afin d'informer, divertir ou promouvoir une marque.",
    activites: [
      "Créer des vidéos",
      "Rédiger des articles",
      "Prendre des photos",
      "Publier du contenu sur différentes plateformes",
    ],
    qualitesRequises: [
      "Créativité",
      "Communication",
      "Organisation",
      "Curiosité",
    ],
  },
  {
    slug: "seo-sea-manager",
    nom: "SEO/SEA Manager",
    domaine: "Marketing Digital",
    image: "",
    descriptionCourte:
      "Il améliore la visibilité des sites internet sur les moteurs de recherche.",
    matieres: ["francais", "anglais"],
    presentation:
      "Le SEO/SEA Manager met en place des stratégies pour qu'un site internet soit facilement trouvé sur les moteurs de recherche grâce au référencement naturel (SEO) ou à la publicité en ligne (SEA).",
    activites: [
      "Optimiser le référencement naturel d'un site",
      "Créer des campagnes publicitaires en ligne",
      "Analyser les performances des campagnes",
      "Suivre l'évolution du trafic",
    ],
    qualitesRequises: [
      "Esprit d'analyse",
      "Curiosité",
      "Organisation",
      "Rigueur",
    ],
  },

  {
    slug: "email-marketeur",
    nom: "Email Marketeur",
    domaine: "Marketing Digital",
    image: "",
    descriptionCourte:
      "Il crée des campagnes d'e-mails pour informer, fidéliser ou vendre.",
    matieres: ["francais"],
    presentation:
      "L'Email Marketeur conçoit des campagnes d'e-mails adaptées aux besoins des entreprises afin de communiquer avec leurs clients et mesurer les résultats obtenus.",
    activites: [
      "Rédiger des e-mails",
      "Créer des campagnes marketing",
      "Segmenter les destinataires",
      "Analyser les statistiques d'envoi",
    ],
    qualitesRequises: [
      "Bonne rédaction",
      "Organisation",
      "Créativité",
      "Rigueur",
    ],
  },

  {
    slug: "growth-hacker",
    nom: "Growth Hacker",
    domaine: "Marketing Digital",
    image: "",
    descriptionCourte:
      "Il trouve des idées innovantes pour accélérer la croissance d'une entreprise.",
    matieres: ["mathematiques", "francais"],
    presentation:
      "Le Growth Hacker teste rapidement différentes stratégies afin d'attirer de nouveaux utilisateurs, d'augmenter les ventes et de développer la notoriété d'une entreprise.",
    activites: [
      "Tester de nouvelles stratégies",
      "Analyser les résultats",
      "Optimiser les campagnes marketing",
      "Proposer des actions innovantes",
    ],
    qualitesRequises: [
      "Créativité",
      "Esprit d'analyse",
      "Curiosité",
      "Autonomie",
    ],
  },

  {
    slug: "product-manager",
    nom: "Product Manager",
    domaine: "Gestion de Produit",
    image: "",
    descriptionCourte:
      "Il pilote le développement d'un produit numérique de l'idée jusqu'à sa mise sur le marché.",
    matieres: ["mathematiques", "francais"],
    presentation:
      "Le Product Manager coordonne les équipes de design, de développement et de marketing afin de créer un produit qui répond aux besoins des utilisateurs.",
    activites: [
      "Définir les fonctionnalités d'un produit",
      "Organiser le travail des équipes",
      "Recueillir les besoins des utilisateurs",
      "Suivre l'évolution du projet",
    ],
    qualitesRequises: [
      "Leadership",
      "Organisation",
      "Communication",
      "Esprit d'analyse",
    ],
  },

  {
    slug: "chef-de-projet-digital",
    nom: "Chef de Projet Digital",
    domaine: "Gestion de Projet",
    image: "",
    descriptionCourte:
      "Il coordonne les équipes afin de mener à bien les projets numériques.",
    matieres: ["mathematiques", "francais"],
    presentation:
      "Le Chef de Projet Digital planifie, organise et supervise les différentes étapes d'un projet numérique en veillant au respect des délais et des objectifs.",
    activites: [
      "Planifier les projets",
      "Coordonner les équipes",
      "Suivre les délais",
      "Présenter l'avancement aux clients",
    ],
    qualitesRequises: [
      "Organisation",
      "Leadership",
      "Communication",
      "Rigueur",
    ],
  },

  {
    slug: "business-developer",
    nom: "Business Developer",
    domaine: "Développement Commercial",
    image: "",
    descriptionCourte:
      "Il recherche de nouveaux clients et développe les activités d'une entreprise.",
    matieres: ["francais", "anglais"],
    presentation:
      "Le Business Developer identifie de nouvelles opportunités commerciales, développe des partenariats et participe à la croissance de l'entreprise.",
    activites: [
      "Prospecter de nouveaux clients",
      "Développer des partenariats",
      "Présenter les offres de l'entreprise",
      "Négocier des contrats",
    ],
    qualitesRequises: [
      "Communication",
      "Persuasion",
      "Organisation",
      "Dynamisme",
    ],
  },

  {
    slug: "entrepreneur-digital",
    nom: "Entrepreneur Digital",
    domaine: "Entrepreneuriat",
    image: "",
    descriptionCourte:
      "Il crée et développe une entreprise basée sur les technologies numériques.",
    matieres: ["mathematiques", "francais"],
    presentation:
      "L'Entrepreneur Digital imagine une idée, crée son entreprise et développe des produits ou services numériques pour répondre aux besoins du marché.",
    activites: [
      "Créer une entreprise",
      "Développer un produit numérique",
      "Rechercher des financements",
      "Piloter la croissance de son activité",
    ],
    qualitesRequises: [
      "Créativité",
      "Leadership",
      "Autonomie",
      "Persévérance",
    ],
  },

  {
    slug: "devops",
    nom: "DevOps",
    domaine: "Infrastructure Informatique",
    image: "",
    descriptionCourte:
      "Il automatise le déploiement et le fonctionnement des applications informatiques.",
    matieres: ["mathematiques", "physique-chimie"],
    presentation:
      "L'ingénieur DevOps met en place des outils qui permettent de développer, tester et déployer rapidement les applications tout en garantissant leur stabilité.",
    activites: [
      "Automatiser les déploiements",
      "Surveiller les serveurs",
      "Améliorer les performances",
      "Collaborer avec les développeurs",
    ],
    qualitesRequises: [
      "Logique",
      "Rigueur",
      "Organisation",
      "Esprit d'équipe",
    ],
  },

  {
    slug: "cybersecurite",
    nom: "Expert Cybersécurité",
    domaine: "Cybersécurité",
    image: "",
    descriptionCourte:
      "Il protège les systèmes informatiques contre les attaques et les cybermenaces.",
    matieres: ["mathematiques", "physique-chimie"],
    presentation:
      "L'expert en cybersécurité protège les réseaux, les applications et les données contre les piratages. Il met en place des solutions de sécurité et sensibilise les utilisateurs aux bonnes pratiques.",
    activites: [
      "Sécuriser les systèmes informatiques",
      "Détecter les cyberattaques",
      "Corriger les failles de sécurité",
      "Former les utilisateurs aux bonnes pratiques",
    ],
    qualitesRequises: [
      "Rigueur",
      "Esprit d'analyse",
      "Patience",
      "Réactivité",
    ],
  },
];

/** Utilitaire pour récupérer les métiers d'une matière donnée */
export function getMetiersByMatiere(matiere: Matiere): Metier[] {
  return metiers.filter((m) => m.matieres.includes(matiere));
}

/** Utilitaire pour récupérer un métier par son slug */
export function getMetierBySlug(slug: string): Metier | undefined {
  return metiers.find((m) => m.slug === slug);
}

export const matieresList: { slug: Matiere; nom: string; emoji: string }[] = [
  { slug: "mathematiques", nom: "Mathématiques", emoji: "➗" },
  { slug: "francais", nom: "Français", emoji: "📖" },
  { slug: "svt", nom: "SVT", emoji: "🌱" },
  { slug: "physique-chimie", nom: "Physique-Chimie", emoji: "⚗️" },
  { slug: "histoire-geo", nom: "Histoire-Géo", emoji: "🗺️" },
  { slug: "anglais", nom: "Anglais", emoji: "🇬🇧" },
  { slug: "arts-plastiques", nom: "Éducation Artistique", emoji: "🎨" },
  { slug: "eps", nom: "EPS", emoji: "⚽" },
];
