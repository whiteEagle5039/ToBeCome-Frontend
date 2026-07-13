/**
 * Contenu du questionnaire RIASEC — 36 questions, 6 blocs, 6 archétypes.
 * Ce fichier est la source du seed : tout est ensuite stocké en base
 * (RiasecBloc, QuestionRiasec, QuestionRiasecOption, ArchetypeRiasec)
 * et modifiable sans toucher au code de l'application.
 *
 * Conventions :
 * - poids : points attribués par dimension, ex { R: 3 } ou { S: 2, E: 1 }
 * - SCENARIO : l'ordre des options est randomisé à l'affichage
 * - ECHELLE  : 4 options fixes (0 à 3 points) sur une seule dimension
 */

export type Lettre = "R" | "I" | "A" | "S" | "E" | "C";

export type OptionSeed = { texte: string; poids: Partial<Record<Lettre, number>> };

export type QuestionSeed = {
  bloc: number;
  type: "SCENARIO" | "ECHELLE";
  intitule: string;
  dimension?: Lettre; // pour ECHELLE
  options: OptionSeed[];
};

export const BLOCS_RIASEC = [
  { numero: 1, titre: "Ton vibe au quotidien", description: "Scénarios de tous les jours", couleur: "#0F766E" },
  { numero: 2, titre: "En mode social", description: "Scénarios relationnels", couleur: "#3D5A80" },
  { numero: 3, titre: "Face à un défi", description: "Scénarios problème", couleur: "#8B5CF6" },
  { numero: 4, titre: "Tes skills réels", description: "Tes compétences, honnêtement", couleur: "#E07856" },
  { numero: 5, titre: "Ton radar interne", description: "Ce qui te ressemble vraiment", couleur: "#C9A227" },
  { numero: 6, titre: "Projette ton futur", description: "Choix projectifs", couleur: "#5BA85B" },
];

export const ARCHETYPES_RIASEC = [
  {
    lettre: "R",
    nom: "Le Bâtisseur",
    accroche: "Tu aimes concevoir, fabriquer et faire fonctionner les choses.",
    explication:
      "Tu apprécies les activités concrètes et le travail sur le terrain. Tu es à l'aise avec les outils, les systèmes techniques et la résolution de problèmes pratiques. Ces qualités sont recherchées dans les métiers techniques et l'ingénierie.",
    qualites: ["Pragmatique", "Manuel", "Persévérant", "Concret", "Fiable"],
    couleur: "#D4A574",
  },
  {
    lettre: "I",
    nom: "L'Analyste",
    accroche: "Tu aimes comprendre, analyser et résoudre des problèmes.",
    explication:
      "Tu apprécies comprendre le fonctionnement des choses et tu prends plaisir à résoudre des problèmes complexes. Tu es persévérant, analytique et méthodique. Ces qualités sont très recherchées dans les métiers du numérique.",
    qualites: ["Curieux", "Analytique", "Logique", "Méthodique", "Persévérant"],
    couleur: "#8B5CF6",
  },
  {
    lettre: "A",
    nom: "Le Créateur",
    accroche: "Tu aimes imaginer, concevoir et exprimer des idées originales.",
    explication:
      "Tu apprécies les environnements où l'originalité et la sensibilité comptent autant que la méthode. Tu sais transformer une idée en quelque chose de visible, de sensible ou de vivant. Ces qualités sont précieuses dans le design et les métiers créatifs du numérique.",
    qualites: ["Créatif", "Sensible", "Original", "Expressif", "Ouvert d'esprit"],
    couleur: "#E07856",
  },
  {
    lettre: "S",
    nom: "L'Aidant",
    accroche: "Tu aimes comprendre, aider et faire grandir les autres.",
    explication:
      "Tu apprécies les échanges, l'écoute et le travail en équipe. Tu sais expliquer, rassurer et fédérer un groupe autour d'un objectif commun. Ces qualités sont essentielles dans les métiers orientés utilisateurs et pédagogie.",
    qualites: ["À l'écoute", "Communicatif", "Empathique", "Coopératif", "Pédagogue"],
    couleur: "#5BA85B",
  },
  {
    lettre: "E",
    nom: "Le Stratège",
    accroche: "Tu aimes convaincre, décider et faire avancer les projets.",
    explication:
      "Tu apprécies prendre des initiatives, porter une vision et entraîner un groupe vers un objectif. Tu es à l'aise pour décider vite et assumer des responsabilités. Ces qualités sont recherchées dans les métiers du management et de l'entrepreneuriat numérique.",
    qualites: ["Meneur", "Persuasif", "Décidé", "Ambitieux", "Réactif"],
    couleur: "#3D5A80",
  },
  {
    lettre: "C",
    nom: "L'Organisateur",
    accroche: "Tu aimes structurer, vérifier et faire les choses avec rigueur.",
    explication:
      "Tu apprécies les environnements clairs, méthodiques et bien organisés. Tu es à l'aise avec les données, les processus et le contrôle de la qualité. Ces qualités sont très recherchées dans l'analyse de données et la gestion de projet.",
    qualites: ["Rigoureux", "Organisé", "Fiable", "Précis", "Structuré"],
    couleur: "#C9A227",
  },
];

const ECHELLE_SKILLS = ["Pas trop", "Moyen", "Bien", "À fond"];
const ECHELLE_IDENTITE = ["Pas vraiment", "Un peu", "Bien", "Carrément"];

function echelle(dimension: Lettre, labels: string[]): OptionSeed[] {
  return labels.map((texte, i) => ({ texte, poids: { [dimension]: i } as Partial<Record<Lettre, number>> }));
}

export const QUESTIONS_RIASEC: QuestionSeed[] = [
  // ── Bloc 1 — Ton vibe au quotidien ─────────────────────────────────────────
  {
    bloc: 1,
    type: "SCENARIO",
    intitule: "Samedi, journée libre, zéro obligation. En vrai tu fais quoi ?",
    options: [
      { texte: "Bricoler, réparer ou monter un truc de tes mains", poids: { R: 3 } },
      { texte: "Plonger dans un sujet qui te fascine, lire, fouiller", poids: { I: 3 } },
      { texte: "Créer du contenu, dessiner, faire de la musique", poids: { A: 3 } },
      { texte: "Voir tes potes, organiser une sortie", poids: { S: 2, E: 1 } },
    ],
  },
  {
    bloc: 1,
    type: "SCENARIO",
    intitule: "Une vidéo passe sur ton feed. Celle qui te capte direct :",
    options: [
      { texte: "\"Comment c'est fabriqué\" ou des tutos concrets", poids: { R: 3 } },
      { texte: "Un truc qui explique un phénomène stylé", poids: { I: 3 } },
      { texte: "Un clip créatif, une oeuvre, un design", poids: { A: 3 } },
      { texte: "Le parcours de quelqu'un qui a réussi son business", poids: { E: 3 } },
    ],
  },
  {
    bloc: 1,
    type: "SCENARIO",
    intitule: "On te donne 20 000 F sans condition. Réflexe honnête :",
    options: [
      { texte: "Du matériel pour bricoler ou fabriquer", poids: { R: 2 } },
      { texte: "Des livres, une formation en ligne", poids: { I: 2 } },
      { texte: "De quoi créer (matériel artistique, design)", poids: { A: 2 } },
      { texte: "Tu aides un proche qui en a besoin", poids: { S: 3 } },
      { texte: "Tu lances un petit business", poids: { E: 3 } },
      { texte: "Tu épargnes avec un plan précis", poids: { C: 3 } },
    ],
  },
  {
    bloc: 1,
    type: "SCENARIO",
    intitule: "Ton tonton ouvre un commerce à Cotonou et te demande un coup de main. Tu préfères :",
    options: [
      { texte: "Installer, aménager, monter les rayons", poids: { R: 3 } },
      { texte: "Analyser ce qui se vend le mieux et pourquoi", poids: { I: 2, C: 1 } },
      { texte: "Créer le logo, l'ambiance, la déco", poids: { A: 3 } },
      { texte: "Accueillir et conseiller les clients", poids: { S: 3 } },
      { texte: "Négocier avec les fournisseurs", poids: { E: 3 } },
      { texte: "Tenir les comptes et les stocks", poids: { C: 3 } },
    ],
  },
  {
    bloc: 1,
    type: "SCENARIO",
    intitule: "Ton appli préférée bug. Premier réflexe :",
    options: [
      { texte: "Tu testes plein de manipulations jusqu'à ce que ça marche", poids: { R: 2 } },
      { texte: "Tu cherches l'origine exacte du problème", poids: { I: 3 } },
      { texte: "Tu signales le bug avec une explication carrée", poids: { C: 2 } },
      { texte: "Tu demandes à quelqu'un qui s'y connaît", poids: { S: 1 } },
    ],
  },
  {
    bloc: 1,
    type: "SCENARIO",
    intitule: "Dans un projet scolaire, le moment que tu préfères :",
    options: [
      { texte: "Le moment où on passe à la réalisation concrète", poids: { R: 3 } },
      { texte: "La phase de recherche et de réflexion", poids: { I: 3 } },
      { texte: "Le brainstorm d'idées originales", poids: { A: 3 } },
      { texte: "Quand l'équipe avance soudée", poids: { S: 3 } },
    ],
  },

  // ── Bloc 2 — En mode social ────────────────────────────────────────────────
  {
    bloc: 2,
    type: "SCENARIO",
    intitule: "Travail de groupe, aucun rôle distribué. Tu deviens naturellement :",
    options: [
      { texte: "Celui qui fait le travail technique et concret", poids: { R: 2 } },
      { texte: "Celui qui creuse, vérifie, apporte la matière", poids: { I: 2 } },
      { texte: "Celui qui amène les idées créatives", poids: { A: 2 } },
      { texte: "Celui qui soude le groupe et motive", poids: { S: 3 } },
      { texte: "Celui qui prend le lead et décide", poids: { E: 3 } },
      { texte: "Celui qui planifie et suit les délais", poids: { C: 3 } },
    ],
  },
  {
    bloc: 2,
    type: "SCENARIO",
    intitule: "Un ami traverse une période difficile. Toi tu :",
    options: [
      { texte: "Tu l'écoutes vraiment, longtemps, sans juger", poids: { S: 3 } },
      { texte: "Tu cherches à comprendre la cause profonde", poids: { I: 2, S: 1 } },
      { texte: "Tu le sors, tu le changes d'air avec une activité", poids: { A: 1, R: 1 } },
      { texte: "Tu l'aides à faire un plan pour s'en sortir", poids: { E: 2, C: 1 } },
    ],
  },
  {
    bloc: 2,
    type: "SCENARIO",
    intitule: "Dans un débat en classe, tu es plutôt :",
    options: [
      { texte: "Celui qui ramène les faits et les preuves", poids: { I: 3 } },
      { texte: "Celui qui défend une cause qui lui tient à coeur", poids: { S: 2 } },
      { texte: "Celui qui propose un angle que personne n'a vu", poids: { A: 3 } },
      { texte: "Celui qui rallie les autres à son point de vue", poids: { E: 3 } },
    ],
  },
  {
    bloc: 2,
    type: "SCENARIO",
    intitule: "Quand tu rencontres quelqu'un, tu remarques d'abord :",
    options: [
      { texte: "S'il a l'air fiable, carré", poids: { C: 2, R: 1 } },
      { texte: "Si ce qu'il dit est cohérent, logique", poids: { I: 3 } },
      { texte: "Son style, son énergie, sa créativité", poids: { A: 3 } },
      { texte: "Comment il traite les autres", poids: { S: 3 } },
    ],
  },
  {
    bloc: 2,
    type: "SCENARIO",
    intitule: "On te demande d'organiser un événement de classe. Ton plaisir :",
    options: [
      { texte: "Gérer la logistique, le matériel, le lieu", poids: { R: 2, C: 1 } },
      { texte: "Concevoir le thème, l'identité visuelle", poids: { A: 3 } },
      { texte: "Mobiliser et coordonner tout le monde", poids: { E: 3 } },
      { texte: "Faire le planning, le budget, les listes", poids: { C: 3 } },
    ],
  },
  {
    bloc: 2,
    type: "SCENARIO",
    intitule: "Ton mode de communication naturel :",
    options: [
      { texte: "Direct, efficace, on va à l'essentiel", poids: { E: 2, C: 1 } },
      { texte: "Posé, à l'écoute, je ressens les gens", poids: { S: 3 } },
      { texte: "Créatif : image, vidéo, meme, son", poids: { A: 3 } },
      { texte: "Précis, argumenté, documenté", poids: { I: 3 } },
    ],
  },

  // ── Bloc 3 — Face à un défi ────────────────────────────────────────────────
  {
    bloc: 3,
    type: "SCENARIO",
    intitule: "Un problème bien compliqué débarque. Ton approche :",
    options: [
      { texte: "Je teste concrètement, j'apprends en faisant", poids: { R: 3 } },
      { texte: "Je l'analyse à fond avant d'agir", poids: { I: 3 } },
      { texte: "Je cherche une solution créative inédite", poids: { A: 3 } },
      { texte: "Je découpe en étapes et je planifie", poids: { C: 3 } },
    ],
  },
  {
    bloc: 3,
    type: "SCENARIO",
    intitule: "Une règle te paraît injuste au collège. Tu :",
    options: [
      { texte: "Tu montes une action collective", poids: { E: 3 } },
      { texte: "Tu cherches les textes officiels, tu t'informes", poids: { I: 2, C: 1 } },
      { texte: "Tu crées un visuel ou une affiche pour exprimer ça", poids: { A: 3 } },
      { texte: "Tu en parles posément avec un adulte de confiance", poids: { S: 3 } },
    ],
  },
  {
    bloc: 3,
    type: "SCENARIO",
    intitule: "Tu tombes sur un contenu très technique et difficile :",
    options: [
      { texte: "Je m'accroche, j'adore le challenge intellectuel", poids: { I: 3 } },
      { texte: "J'en fais un schéma pour visualiser", poids: { A: 1, C: 2 } },
      { texte: "Je cherche à quoi ça sert concrètement", poids: { R: 3 } },
      { texte: "Je trouve quelqu'un pour m'expliquer", poids: { S: 2 } },
    ],
  },
  {
    bloc: 3,
    type: "SCENARIO",
    intitule: "Tu vois un jeune de ton âge qui a percé. Ta vraie première pensée :",
    options: [
      { texte: "\"Concrètement, il a construit quoi, étape par étape ?\"", poids: { R: 2, C: 1 } },
      { texte: "\"Quel est le mécanisme derrière son succès ?\"", poids: { I: 3 } },
      { texte: "\"Ça m'inspire, j'ai envie de créer\"", poids: { A: 3 } },
      { texte: "\"Quelle stratégie il a déroulée ?\"", poids: { E: 3 } },
    ],
  },
  {
    bloc: 3,
    type: "SCENARIO",
    intitule: "Si tu pouvais régler UN problème au Bénin, ce serait :",
    options: [
      { texte: "Les infrastructures, le concret du quotidien", poids: { R: 3 } },
      { texte: "Comprendre et résoudre un grand enjeu (santé, climat)", poids: { I: 3 } },
      { texte: "L'accès à la culture et à l'expression", poids: { A: 3 } },
      { texte: "L'éducation et l'accompagnement des jeunes", poids: { S: 3 } },
      { texte: "Créer de l'emploi, dynamiser l'économie", poids: { E: 3 } },
      { texte: "L'organisation et l'efficacité des services", poids: { C: 3 } },
    ],
  },
  {
    bloc: 3,
    type: "SCENARIO",
    intitule: "Tu échoues à quelque chose qui comptait. Ta réaction :",
    options: [
      { texte: "Je me remets vite au travail, concrètement", poids: { R: 2 } },
      { texte: "J'analyse froidement ce qui n'a pas marché", poids: { I: 3 } },
      { texte: "Je rebondis avec une nouvelle idée", poids: { A: 2, E: 1 } },
      { texte: "Je revois mon plan et ma méthode", poids: { C: 3 } },
    ],
  },

  // ── Bloc 4 — Tes skills réels (échelle 0-3) ────────────────────────────────
  { bloc: 4, type: "ECHELLE", dimension: "R", intitule: "Je gère vraiment bien pour réparer, monter, manipuler des objets concrets", options: echelle("R", ECHELLE_SKILLS) },
  { bloc: 4, type: "ECHELLE", dimension: "I", intitule: "Je gère vraiment bien pour résoudre des énigmes logiques, comprendre des choses abstraites", options: echelle("I", ECHELLE_SKILLS) },
  { bloc: 4, type: "ECHELLE", dimension: "A", intitule: "Je gère vraiment bien pour créer, imaginer, donner vie à des idées originales", options: echelle("A", ECHELLE_SKILLS) },
  { bloc: 4, type: "ECHELLE", dimension: "S", intitule: "Je gère vraiment bien pour écouter, conseiller, mettre les autres à l'aise", options: echelle("S", ECHELLE_SKILLS) },
  { bloc: 4, type: "ECHELLE", dimension: "E", intitule: "Je gère vraiment bien pour convaincre, motiver, prendre les devants", options: echelle("E", ECHELLE_SKILLS) },
  { bloc: 4, type: "ECHELLE", dimension: "C", intitule: "Je gère vraiment bien pour organiser, planifier, gérer les détails sans rien oublier", options: echelle("C", ECHELLE_SKILLS) },

  // ── Bloc 5 — Ton radar interne (échelle 0-3) ───────────────────────────────
  { bloc: 5, type: "ECHELLE", dimension: "R", intitule: "\"J'ai besoin de toucher, faire, manipuler pour me sentir utile\"", options: echelle("R", ECHELLE_IDENTITE) },
  { bloc: 5, type: "ECHELLE", dimension: "I", intitule: "\"Je dois comprendre le fond des choses avant d'agir\"", options: echelle("I", ECHELLE_IDENTITE) },
  { bloc: 5, type: "ECHELLE", dimension: "A", intitule: "\"Je me sens vivant quand je crée quelque chose d'unique\"", options: echelle("A", ECHELLE_IDENTITE) },
  { bloc: 5, type: "ECHELLE", dimension: "S", intitule: "\"Le bien-être des autres compte énormément pour moi\"", options: echelle("S", ECHELLE_IDENTITE) },
  { bloc: 5, type: "ECHELLE", dimension: "E", intitule: "\"J'aime mener, influencer, faire bouger les choses\"", options: echelle("E", ECHELLE_IDENTITE) },
  { bloc: 5, type: "ECHELLE", dimension: "C", intitule: "\"J'ai besoin d'ordre, de cadre et de prévisibilité\"", options: echelle("C", ECHELLE_IDENTITE) },

  // ── Bloc 6 — Projette ton futur ────────────────────────────────────────────
  {
    bloc: 6,
    type: "SCENARIO",
    intitule: "Le métier qui te ferait lever le matin sans forcer :",
    options: [
      { texte: "Construire, fabriquer, faire fonctionner du concret", poids: { R: 3 } },
      { texte: "Chercher, analyser, résoudre des problèmes complexes", poids: { I: 3 } },
      { texte: "Créer des choses qui n'existent pas encore", poids: { A: 3 } },
      { texte: "Aider, former, prendre soin des gens", poids: { S: 3 } },
      { texte: "Diriger des projets, entreprendre", poids: { E: 3 } },
      { texte: "Organiser, gérer, faire tourner des systèmes", poids: { C: 3 } },
    ],
  },
  {
    bloc: 6,
    type: "SCENARIO",
    intitule: "Ton métier de rêve doit AVANT TOUT :",
    options: [
      { texte: "Te donner des résultats concrets et visibles", poids: { R: 3 } },
      { texte: "Te faire apprendre et comprendre en continu", poids: { I: 3 } },
      { texte: "Te laisser créer librement", poids: { A: 3 } },
      { texte: "Avoir un impact positif sur les gens", poids: { S: 3 } },
      { texte: "Te donner du pouvoir d'action et d'influence", poids: { E: 3 } },
      { texte: "T'offrir un cadre clair et stable", poids: { C: 3 } },
    ],
  },
  {
    bloc: 6,
    type: "SCENARIO",
    intitule: "Un superpouvoir au choix :",
    options: [
      { texte: "Réparer ou construire n'importe quoi en une seconde", poids: { R: 3 } },
      { texte: "Tout comprendre instantanément", poids: { I: 3 } },
      { texte: "Créer n'importe quoi par la pensée", poids: { A: 3 } },
      { texte: "Ressentir et apaiser les émotions des autres", poids: { S: 3 } },
      { texte: "Convaincre n'importe qui", poids: { E: 3 } },
      { texte: "Que tout soit toujours parfaitement organisé", poids: { C: 3 } },
    ],
  },
  {
    bloc: 6,
    type: "SCENARIO",
    intitule: "Dans 10 ans, tu te vois fier d'avoir :",
    options: [
      { texte: "Construit quelque chose de solide et durable", poids: { R: 3 } },
      { texte: "Percé un mystère, maîtrisé un domaine pointu", poids: { I: 3 } },
      { texte: "Créé une oeuvre qui te ressemble", poids: { A: 3 } },
      { texte: "Aidé concrètement plein de personnes", poids: { S: 3 } },
      { texte: "Bâti ton entreprise, dirigé ton équipe", poids: { E: 3 } },
      { texte: "Mis en place des systèmes qui tournent parfaitement", poids: { C: 3 } },
    ],
  },
  {
    bloc: 6,
    type: "SCENARIO",
    intitule: "Le compliment qui te touche le plus :",
    options: [
      { texte: "\"Tu as des mains en or, tu sais tout faire\"", poids: { R: 3 } },
      { texte: "\"Tu as vu ce que personne d'autre n'a capté\"", poids: { I: 3 } },
      { texte: "\"Tu as un truc en plus, une vraie patte\"", poids: { A: 3 } },
      { texte: "\"Tu es quelqu'un de bien, on se sent bien avec toi\"", poids: { S: 3 } },
      { texte: "\"Tu as entraîné tout le monde derrière toi\"", poids: { E: 3 } },
      { texte: "\"Avec toi, c'est carré, on peut compter dessus\"", poids: { C: 3 } },
    ],
  },
  {
    bloc: 6,
    type: "SCENARIO",
    intitule: "Ce qui t'agace le plus :",
    options: [
      { texte: "Quand on parle au lieu d'agir concrètement", poids: { R: 2 } },
      { texte: "L'ignorance, le refus de réfléchir", poids: { I: 3 } },
      { texte: "La routine vide, le manque de créativité", poids: { A: 3 } },
      { texte: "L'injustice, qu'on traite mal quelqu'un", poids: { S: 3 } },
      { texte: "L'immobilisme, quand rien n'avance", poids: { E: 3 } },
      { texte: "Le désordre, l'imprévu, le bâclé", poids: { C: 3 } },
    ],
  },
];
