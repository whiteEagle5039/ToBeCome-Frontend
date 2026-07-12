// Types partagés — Espace Établissement
// Ces types décrivent la forme des données attendues côté front.
// Aucune valeur n'est codée en dur : ils servent de contrat pour brancher
// l'API / Supabase plus tard.

export type StatutEleve = "actif" | "inactif";
export type StatutMatricule = "utilise" | "non_utilise";
export type CanalEnvoi = "sms" | "whatsapp" | "email";
export type StatutEnvoi = "envoye" | "echec" | "en_attente";
export type TypeAlerte = "inactivite" | "bloque";
export type TypeRapport = "classe" | "eleve";
export type FormuleAbonnement = "decouverte" | "standard" | "etablissement_plus";

export interface Eleve {
  id: string;
  matricule: string;
  nom: string;
  prenom: string;
  classeId: string;
  classeNom: string;
  statut: StatutEleve;
  riasecComplete: boolean;
  progressionPct: number; // 0-100
  badgesObtenus: number;
  dateInscription: string; // ISO date
  responsable?: Responsable;
}

export interface Responsable {
  id: string;
  nom: string;
  telephone: string;
  email: string;
  lienEleveId: string;
}

export interface Classe {
  id: string;
  nom: string;
  niveau: string;
  effectif: number;
}

export interface EnvoiAcces {
  id: string;
  eleveId: string;
  eleveNom: string;
  canal: CanalEnvoi;
  date: string;
  statut: StatutEnvoi;
}

export interface Alerte {
  id: string;
  type: TypeAlerte;
  eleveId: string;
  eleveNom: string;
  classeNom: string;
  message: string;
  date: string;
}

export interface Rapport {
  id: string;
  type: TypeRapport;
  cibleNom: string;
  dateGeneration: string;
  url: string;
}

export interface Matricule {
  id: string;
  code: string;
  statut: StatutMatricule;
  classeNom?: string;
  dateGeneration: string;
}

export interface Facture {
  id: string;
  periode: string;
  montantFcfa: number;
  statut: "payee" | "en_attente";
  url: string;
}

export interface Abonnement {
  formule: FormuleAbonnement;
  licencesUtilisees: number;
  licencesTotal: number;
  dateExpiration: string;
  factures: Facture[];
}

export interface DomaineStat {
  nom: string;
  nbExplorations: number;
}

export interface MetierStat {
  nom: string;
  domaine: string;
  nbConsultations: number;
}

export interface DashboardOverview {
  elevesActifs: number;
  elevesInactifs: number;
  progressionMoyennePct: number;
  domainesTopExplores: DomaineStat[];
  metiersTopConsultes: MetierStat[];
  derniereMiseAJour: string; // ISO datetime
}

/** Taux de réussite affiché sur le site vitrine (ex : BEPC 2025 — 92 %). */
export interface ResultatExamen {
  examen: string; // "CEP", "BEPC", "BAC"...
  annee: string; // "2025"
  tauxReussite: number; // 0-100
}

export interface ParametresEtablissement {
  nom: string;
  description: string;
  logoUrl: string | null;
  telephone: string;
  email: string;
  adresse: string;
  filieres: string[];
  resultatsExamens: ResultatExamen[];
  lienPublic: string;
}
