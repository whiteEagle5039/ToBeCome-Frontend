-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ELEVE_COLLEGE', 'ELEVE_LYCEE', 'PARENT', 'ETABLISSEMENT', 'ADMIN');

-- CreateEnum
CREATE TYPE "EtablissementStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'REJECTED');

-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('ESSENTIEL', 'STANDARD', 'PREMIUM');

-- CreateEnum
CREATE TYPE "NiveauCollege" AS ENUM ('SIXIEME', 'CINQUIEME', 'QUATRIEME', 'TROISIEME');

-- CreateEnum
CREATE TYPE "NiveauLycee" AS ENUM ('SECONDE', 'PREMIERE', 'TERMINALE');

-- CreateEnum
CREATE TYPE "MissionStep" AS ENUM ('QUIZ', 'MISE_EN_SITUATION', 'DEFI_RAPIDE');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('EMAIL', 'SMS', 'WHATSAPP', 'PUSH');

-- CreateEnum
CREATE TYPE "NotificationFrequency" AS ENUM ('IMMEDIATE', 'DAILY', 'WEEKLY');

-- CreateEnum
CREATE TYPE "MatriculeStatus" AS ENUM ('LIBRE', 'UTILISE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "etablissement_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "logoUrl" TEXT,
    "adresse" TEXT,
    "ville" TEXT,
    "pays" TEXT NOT NULL DEFAULT 'Bénin',
    "telephone" TEXT,
    "email" TEXT,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "status" "EtablissementStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "etablissement_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pages_publiques" (
    "id" TEXT NOT NULL,
    "etablissementId" TEXT NOT NULL,
    "filieres" TEXT[],
    "photosUrls" TEXT[],
    "statsPubliques" JSONB,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pages_publiques_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "etablissementId" TEXT NOT NULL,
    "plan" "SubscriptionPlan" NOT NULL,
    "maxLicences" INTEGER NOT NULL,
    "licencesUsed" INTEGER NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'XOF',
    "paidAt" TIMESTAMP(3),
    "invoiceUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classes" (
    "id" TEXT NOT NULL,
    "etablissementId" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "niveau" TEXT NOT NULL,
    "anneesScolaire" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matricules" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "etablissementId" TEXT NOT NULL,
    "classeId" TEXT,
    "status" "MatriculeStatus" NOT NULL DEFAULT 'LIBRE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "matricules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eleve_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "matriculeId" TEXT NOT NULL,
    "etablissementId" TEXT NOT NULL,
    "classeId" TEXT,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "dateNaissance" TIMESTAMP(3) NOT NULL,
    "avatarUrl" TEXT,
    "niveauCollege" "NiveauCollege",
    "niveauLycee" "NiveauLycee",
    "isLycee" BOOLEAN NOT NULL DEFAULT false,
    "xpTotal" INTEGER NOT NULL DEFAULT 0,
    "streakJours" INTEGER NOT NULL DEFAULT 0,
    "derniereConnexion" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "eleve_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "xp_historique" (
    "id" TEXT NOT NULL,
    "eleveId" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "raison" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "xp_historique_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "badges" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eleve_badges" (
    "id" TEXT NOT NULL,
    "eleveId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "obtenuAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "eleve_badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "domaines" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "iconUrl" TEXT,
    "couleur" TEXT,

    CONSTRAINT "domaines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matieres" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "emoji" TEXT,

    CONSTRAINT "matieres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metiers" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "domaineId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "descriptionCourte" TEXT NOT NULL,
    "videoUrl" TEXT,
    "imageUrl" TEXT,
    "riasecTypes" TEXT[],
    "niveauEtudes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "metiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metier_matieres" (
    "metierId" TEXT NOT NULL,
    "matiereId" TEXT NOT NULL,
    "importance" INTEGER NOT NULL DEFAULT 3,

    CONSTRAINT "metier_matieres_pkey" PRIMARY KEY ("metierId","matiereId")
);

-- CreateTable
CREATE TABLE "metiers_explores" (
    "id" TEXT NOT NULL,
    "eleveId" TEXT NOT NULL,
    "metierId" TEXT NOT NULL,
    "exploredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "metiers_explores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metiers_maitrises" (
    "id" TEXT NOT NULL,
    "eleveId" TEXT NOT NULL,
    "metierId" TEXT NOT NULL,
    "maitriseAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "metiers_maitrises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favoris" (
    "id" TEXT NOT NULL,
    "eleveId" TEXT NOT NULL,
    "metierId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favoris_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "missions" (
    "id" TEXT NOT NULL,
    "metierId" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ordre" INTEGER NOT NULL,

    CONSTRAINT "missions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mission_etapes" (
    "id" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "ordre" INTEGER NOT NULL,
    "type" "MissionStep" NOT NULL,
    "titre" TEXT NOT NULL,
    "contenu" JSONB NOT NULL,

    CONSTRAINT "mission_etapes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mission_progres" (
    "id" TEXT NOT NULL,
    "eleveId" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "isComplete" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mission_progres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mission_step_progres" (
    "id" TEXT NOT NULL,
    "progresId" TEXT NOT NULL,
    "etapeId" TEXT NOT NULL,
    "isComplete" BOOLEAN NOT NULL DEFAULT false,
    "score" INTEGER,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "mission_step_progres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "riasec_resultats" (
    "id" TEXT NOT NULL,
    "eleveId" TEXT NOT NULL,
    "scoreR" INTEGER NOT NULL DEFAULT 0,
    "scoreI" INTEGER NOT NULL DEFAULT 0,
    "scoreA" INTEGER NOT NULL DEFAULT 0,
    "scoreS" INTEGER NOT NULL DEFAULT 0,
    "scoreE" INTEGER NOT NULL DEFAULT 0,
    "scoreC" INTEGER NOT NULL DEFAULT 0,
    "typesPrincipaux" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "riasec_resultats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parent_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "telephone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parent_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parent_enfants" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "eleveId" TEXT NOT NULL,
    "lienParente" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "parent_enfants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commentaires_parents" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "eleveId" TEXT NOT NULL,
    "contenu" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "commentaires_parents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notif_configs" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "canal" "NotificationChannel" NOT NULL DEFAULT 'PUSH',
    "frequence" "NotificationFrequency" NOT NULL DEFAULT 'DAILY',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notif_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eleve_responsables" (
    "id" TEXT NOT NULL,
    "eleveId" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "email" TEXT,
    "lienParente" TEXT NOT NULL,

    CONSTRAINT "eleve_responsables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "eleveId" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "decouvertes_jour" (
    "id" TEXT NOT NULL,
    "metierId" TEXT NOT NULL,
    "saviez_vous" TEXT NOT NULL,
    "dateAffiche" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "photoUrl" TEXT,

    CONSTRAINT "decouvertes_jour_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_token_key" ON "password_reset_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "etablissement_profiles_userId_key" ON "etablissement_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "etablissement_profiles_slug_key" ON "etablissement_profiles"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "pages_publiques_etablissementId_key" ON "pages_publiques"("etablissementId");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_etablissementId_key" ON "subscriptions"("etablissementId");

-- CreateIndex
CREATE UNIQUE INDEX "matricules_code_key" ON "matricules"("code");

-- CreateIndex
CREATE UNIQUE INDEX "eleve_profiles_userId_key" ON "eleve_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "eleve_profiles_matriculeId_key" ON "eleve_profiles"("matriculeId");

-- CreateIndex
CREATE UNIQUE INDEX "badges_nom_key" ON "badges"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "eleve_badges_eleveId_badgeId_key" ON "eleve_badges"("eleveId", "badgeId");

-- CreateIndex
CREATE UNIQUE INDEX "domaines_nom_key" ON "domaines"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "matieres_nom_key" ON "matieres"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "metiers_nom_key" ON "metiers"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "metiers_slug_key" ON "metiers"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "metiers_explores_eleveId_metierId_key" ON "metiers_explores"("eleveId", "metierId");

-- CreateIndex
CREATE UNIQUE INDEX "metiers_maitrises_eleveId_metierId_key" ON "metiers_maitrises"("eleveId", "metierId");

-- CreateIndex
CREATE UNIQUE INDEX "favoris_eleveId_metierId_key" ON "favoris"("eleveId", "metierId");

-- CreateIndex
CREATE UNIQUE INDEX "mission_progres_eleveId_missionId_key" ON "mission_progres"("eleveId", "missionId");

-- CreateIndex
CREATE UNIQUE INDEX "mission_step_progres_progresId_etapeId_key" ON "mission_step_progres"("progresId", "etapeId");

-- CreateIndex
CREATE UNIQUE INDEX "riasec_resultats_eleveId_key" ON "riasec_resultats"("eleveId");

-- CreateIndex
CREATE UNIQUE INDEX "parent_profiles_userId_key" ON "parent_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "parent_enfants_parentId_eleveId_key" ON "parent_enfants"("parentId", "eleveId");

-- CreateIndex
CREATE UNIQUE INDEX "notif_configs_parentId_key" ON "notif_configs"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "decouvertes_jour_dateAffiche_key" ON "decouvertes_jour"("dateAffiche");

-- CreateIndex
CREATE UNIQUE INDEX "admin_profiles_userId_key" ON "admin_profiles"("userId");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "etablissement_profiles" ADD CONSTRAINT "etablissement_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pages_publiques" ADD CONSTRAINT "pages_publiques_etablissementId_fkey" FOREIGN KEY ("etablissementId") REFERENCES "etablissement_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_etablissementId_fkey" FOREIGN KEY ("etablissementId") REFERENCES "etablissement_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_etablissementId_fkey" FOREIGN KEY ("etablissementId") REFERENCES "etablissement_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matricules" ADD CONSTRAINT "matricules_etablissementId_fkey" FOREIGN KEY ("etablissementId") REFERENCES "etablissement_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eleve_profiles" ADD CONSTRAINT "eleve_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eleve_profiles" ADD CONSTRAINT "eleve_profiles_matriculeId_fkey" FOREIGN KEY ("matriculeId") REFERENCES "matricules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eleve_profiles" ADD CONSTRAINT "eleve_profiles_etablissementId_fkey" FOREIGN KEY ("etablissementId") REFERENCES "etablissement_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eleve_profiles" ADD CONSTRAINT "eleve_profiles_classeId_fkey" FOREIGN KEY ("classeId") REFERENCES "classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xp_historique" ADD CONSTRAINT "xp_historique_eleveId_fkey" FOREIGN KEY ("eleveId") REFERENCES "eleve_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eleve_badges" ADD CONSTRAINT "eleve_badges_eleveId_fkey" FOREIGN KEY ("eleveId") REFERENCES "eleve_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eleve_badges" ADD CONSTRAINT "eleve_badges_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "badges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metiers" ADD CONSTRAINT "metiers_domaineId_fkey" FOREIGN KEY ("domaineId") REFERENCES "domaines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metier_matieres" ADD CONSTRAINT "metier_matieres_metierId_fkey" FOREIGN KEY ("metierId") REFERENCES "metiers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metier_matieres" ADD CONSTRAINT "metier_matieres_matiereId_fkey" FOREIGN KEY ("matiereId") REFERENCES "matieres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metiers_explores" ADD CONSTRAINT "metiers_explores_eleveId_fkey" FOREIGN KEY ("eleveId") REFERENCES "eleve_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metiers_explores" ADD CONSTRAINT "metiers_explores_metierId_fkey" FOREIGN KEY ("metierId") REFERENCES "metiers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metiers_maitrises" ADD CONSTRAINT "metiers_maitrises_eleveId_fkey" FOREIGN KEY ("eleveId") REFERENCES "eleve_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metiers_maitrises" ADD CONSTRAINT "metiers_maitrises_metierId_fkey" FOREIGN KEY ("metierId") REFERENCES "metiers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favoris" ADD CONSTRAINT "favoris_eleveId_fkey" FOREIGN KEY ("eleveId") REFERENCES "eleve_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favoris" ADD CONSTRAINT "favoris_metierId_fkey" FOREIGN KEY ("metierId") REFERENCES "metiers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "missions" ADD CONSTRAINT "missions_metierId_fkey" FOREIGN KEY ("metierId") REFERENCES "metiers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_etapes" ADD CONSTRAINT "mission_etapes_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "missions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_progres" ADD CONSTRAINT "mission_progres_eleveId_fkey" FOREIGN KEY ("eleveId") REFERENCES "eleve_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_progres" ADD CONSTRAINT "mission_progres_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "missions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_step_progres" ADD CONSTRAINT "mission_step_progres_progresId_fkey" FOREIGN KEY ("progresId") REFERENCES "mission_progres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_step_progres" ADD CONSTRAINT "mission_step_progres_etapeId_fkey" FOREIGN KEY ("etapeId") REFERENCES "mission_etapes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "riasec_resultats" ADD CONSTRAINT "riasec_resultats_eleveId_fkey" FOREIGN KEY ("eleveId") REFERENCES "eleve_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_profiles" ADD CONSTRAINT "parent_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_enfants" ADD CONSTRAINT "parent_enfants_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "parent_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_enfants" ADD CONSTRAINT "parent_enfants_eleveId_fkey" FOREIGN KEY ("eleveId") REFERENCES "eleve_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentaires_parents" ADD CONSTRAINT "commentaires_parents_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "parent_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notif_configs" ADD CONSTRAINT "notif_configs_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "parent_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eleve_responsables" ADD CONSTRAINT "eleve_responsables_eleveId_fkey" FOREIGN KEY ("eleveId") REFERENCES "eleve_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_eleveId_fkey" FOREIGN KEY ("eleveId") REFERENCES "eleve_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decouvertes_jour" ADD CONSTRAINT "decouvertes_jour_metierId_fkey" FOREIGN KEY ("metierId") REFERENCES "metiers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_profiles" ADD CONSTRAINT "admin_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
