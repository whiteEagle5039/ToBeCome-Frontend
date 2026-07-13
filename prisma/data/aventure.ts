/**
 * Contenu du mode Aventure et de la banque de questions par métier.
 * Source du seed : tout est stocké en base (Mission, MissionEtape,
 * QuestionMetier) et modifiable ensuite sans toucher au code.
 *
 * Structure d'un métier :
 *   Chapitre 1 — Découverte   (Quiz, Situation, Défi rapide)
 *   Chapitre 2 — Pratique     (Quiz, Situation, Défi rapide)
 *   Chapitre 3 — Situation réelle (Quiz, Situation, Défi rapide)
 *   Boss final — Projet complet (Projet final)
 */

export type EtapeSeed = {
  ordre: number;
  type: "QUIZ" | "MISE_EN_SITUATION" | "DEFI_RAPIDE" | "PROJET_FINAL";
  titre: string;
  xpRecompense: number;
  contenu: unknown;
};

export type ChapitreSeed = {
  ordre: number;
  titre: string;
  description: string;
  estBoss: boolean;
  xpRecompense: number;
  etapes: EtapeSeed[];
};

/**
 * Génère la campagne par défaut d'un métier (3 chapitres + boss).
 * Le contenu est générique mais contextualisé au nom du métier ;
 * il peut être personnalisé métier par métier directement en base.
 */
export function chapitresParDefaut(metierNom: string): ChapitreSeed[] {
  return [
    {
      ordre: 1,
      titre: "Découverte",
      description: `Comprendre ce qu'est le métier de ${metierNom} : son rôle, son quotidien, son environnement.`,
      estBoss: false,
      xpRecompense: 100,
      etapes: [
        {
          ordre: 1,
          type: "QUIZ",
          titre: "Quiz — le métier en bref",
          xpRecompense: 30,
          contenu: {
            question: `Quelle est la mission principale d'un professionnel comme ${metierNom} ?`,
            choix: [
              `Exercer le coeur du métier de ${metierNom} au quotidien`,
              "Vendre des produits dans un magasin",
              "Conduire des véhicules de livraison",
              "Présenter la météo à la télévision",
            ],
            bonneReponseIndex: 0,
          },
        },
        {
          ordre: 2,
          type: "MISE_EN_SITUATION",
          titre: "Situation — première journée",
          xpRecompense: 30,
          contenu: {
            scenario: `C'est ta première journée en tant que ${metierNom}. On te confie une petite tâche que tu ne maîtrises pas encore. Que fais-tu ?`,
            choix: [
              { texte: "Je pose des questions et j'observe comment font les autres", estBonneDecision: true },
              { texte: "Je fais semblant de savoir et j'improvise", estBonneDecision: false },
              { texte: "Je refuse la tâche", estBonneDecision: false },
            ],
          },
        },
        {
          ordre: 3,
          type: "DEFI_RAPIDE",
          titre: "Défi rapide — vrai ou faux",
          xpRecompense: 30,
          contenu: {
            affirmation: `Le métier de ${metierNom} demande de continuer à apprendre tout au long de sa carrière.`,
            estVraie: true,
          },
        },
      ],
    },
    {
      ordre: 2,
      titre: "Pratique",
      description: "Appliquer les bases sur des cas simples et apprendre en faisant.",
      estBoss: false,
      xpRecompense: 150,
      etapes: [
        {
          ordre: 1,
          type: "QUIZ",
          titre: "Quiz — les bons réflexes",
          xpRecompense: 30,
          contenu: {
            question: "Quand on débute une nouvelle tâche, quelle est la meilleure approche ?",
            choix: [
              "Découper le travail en petites étapes et avancer une par une",
              "Tout faire d'un coup sans vérifier",
              "Attendre que quelqu'un le fasse à ta place",
              "Passer directement à la fin",
            ],
            bonneReponseIndex: 0,
          },
        },
        {
          ordre: 2,
          type: "MISE_EN_SITUATION",
          titre: "Situation — une erreur est découverte",
          xpRecompense: 30,
          contenu: {
            scenario: `En travaillant, tu découvres une erreur dans ce que tu as produit hier. Personne ne l'a encore remarquée. Que fais-tu ?`,
            choix: [
              { texte: "Je la corrige et je préviens l'équipe pour éviter qu'elle se reproduise", estBonneDecision: true },
              { texte: "Je fais comme si de rien n'était", estBonneDecision: false },
              { texte: "J'accuse un collègue", estBonneDecision: false },
            ],
          },
        },
        {
          ordre: 3,
          type: "DEFI_RAPIDE",
          titre: "Défi rapide — vrai ou faux",
          xpRecompense: 30,
          contenu: {
            affirmation: "Se tromper pendant l'apprentissage fait perdre du temps et ne sert à rien.",
            estVraie: false,
          },
        },
      ],
    },
    {
      ordre: 3,
      titre: "Situation réelle",
      description: "Se confronter à une situation proche du métier réel, avec des contraintes et des choix.",
      estBoss: false,
      xpRecompense: 200,
      etapes: [
        {
          ordre: 1,
          type: "QUIZ",
          titre: "Quiz — gérer les priorités",
          xpRecompense: 30,
          contenu: {
            question: "Un client attend un livrable demain, mais un imprévu urgent arrive. Que fais-tu en premier ?",
            choix: [
              "J'évalue l'impact des deux et je préviens les personnes concernées",
              "J'ignore l'imprévu",
              "J'abandonne le livrable du client",
              "Je ne préviens personne et j'espère que ça passe",
            ],
            bonneReponseIndex: 0,
          },
        },
        {
          ordre: 2,
          type: "MISE_EN_SITUATION",
          titre: "Situation — un client difficile",
          xpRecompense: 30,
          contenu: {
            scenario: `Un client n'est pas satisfait de ton travail de ${metierNom} et le dit sèchement. Ta réaction :`,
            choix: [
              { texte: "J'écoute ses remarques, je reformule son besoin et je propose une correction", estBonneDecision: true },
              { texte: "Je me vexe et je ne réponds plus", estBonneDecision: false },
              { texte: "Je lui dis qu'il n'y connaît rien", estBonneDecision: false },
            ],
          },
        },
        {
          ordre: 3,
          type: "DEFI_RAPIDE",
          titre: "Défi rapide — vrai ou faux",
          xpRecompense: 30,
          contenu: {
            affirmation: `Un professionnel comme ${metierNom} travaille toujours totalement seul, sans jamais échanger avec personne.`,
            estVraie: false,
          },
        },
      ],
    },
    {
      ordre: 4,
      titre: "Projet final",
      description: `Mobiliser tout ce qui a été appris sur un projet complet de ${metierNom}.`,
      estBoss: true,
      xpRecompense: 400,
      etapes: [
        {
          ordre: 1,
          type: "PROJET_FINAL",
          titre: "Projet complet",
          xpRecompense: 100,
          contenu: {
            consigne: `Projet de synthèse : imagine que tu es ${metierNom} et qu'un client te confie un vrai projet (par exemple un site pour un restaurant, une campagne, une étude...). Décris les étapes que tu suivrais, les décisions à prendre et les personnes avec qui tu travaillerais. Quand ta réflexion est complète, valide ton projet.`,
          },
        },
      ],
    },
  ];
}

/**
 * Banque de questions par métier (Défi du jour + Battle).
 * Générique par défaut, personnalisable en base (table questions_metier).
 */
export function banqueQuestionsParDefaut(metierNom: string): {
  type: "QCM" | "VRAI_FAUX";
  question: string;
  choix: string[];
  bonneReponseIndex: number;
}[] {
  return [
    {
      type: "QCM",
      question: `Que fait principalement un professionnel comme ${metierNom} ?`,
      choix: [
        `Le coeur du métier de ${metierNom}`,
        "De la pâtisserie",
        "Du jardinage",
        "De la plomberie",
      ],
      bonneReponseIndex: 0,
    },
    {
      type: "QCM",
      question: "Quelle qualité est la plus utile pour progresser dans un métier du numérique ?",
      choix: ["La curiosité", "La paresse", "L'impatience", "Le désordre"],
      bonneReponseIndex: 0,
    },
    {
      type: "QCM",
      question: "Que faire quand on ne comprend pas quelque chose de nouveau ?",
      choix: [
        "Poser des questions et chercher des explications",
        "Abandonner tout de suite",
        "Faire semblant d'avoir compris",
        "Se mettre en colère",
      ],
      bonneReponseIndex: 0,
    },
    {
      type: "QCM",
      question: "Travailler en équipe, c'est surtout :",
      choix: [
        "Écouter, partager et avancer ensemble",
        "Faire tout le travail des autres",
        "Ne jamais donner son avis",
        "Décider seul sans consulter personne",
      ],
      bonneReponseIndex: 0,
    },
    {
      type: "QCM",
      question: "Pourquoi se tromper peut être utile quand on apprend ?",
      choix: [
        "Parce qu'on apprend de ses erreurs",
        "Ce n'est jamais utile",
        "Parce que ça fait perdre du temps",
        "Parce que ça décourage les autres",
      ],
      bonneReponseIndex: 0,
    },
    {
      type: "VRAI_FAUX",
      question: `Le métier de ${metierNom} évolue avec les nouvelles technologies.`,
      choix: ["Vrai", "Faux"],
      bonneReponseIndex: 0,
    },
    {
      type: "VRAI_FAUX",
      question: "Dans un projet, prévenir tôt quand on est bloqué est une bonne pratique.",
      choix: ["Vrai", "Faux"],
      bonneReponseIndex: 0,
    },
    {
      type: "VRAI_FAUX",
      question: `Pour devenir ${metierNom}, il est interdit de poser des questions.`,
      choix: ["Vrai", "Faux"],
      bonneReponseIndex: 1,
    },
    {
      type: "QCM",
      question: "Quel est le meilleur moyen de mémoriser une nouvelle compétence ?",
      choix: [
        "La pratiquer régulièrement",
        "La lire une seule fois",
        "L'ignorer",
        "Attendre de s'en souvenir tout seul",
      ],
      bonneReponseIndex: 0,
    },
    {
      type: "VRAI_FAUX",
      question: "On peut commencer à découvrir un métier dès le collège.",
      choix: ["Vrai", "Faux"],
      bonneReponseIndex: 0,
    },
  ];
}
