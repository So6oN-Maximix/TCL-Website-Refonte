-- CreateEnum
CREATE TYPE "Role" AS ENUM ('VISITER', 'ATTENTE_MEMBER', 'MEMBER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Poste" AS ENUM ('DEVELOPPEUR', 'PRESIDENT', 'PRESIDENTE', 'VICE_PRESIDENT', 'VICE_PRESIDENTE', 'TRESORIER', 'TRESORIERE', 'SECRETAIRE', 'COACH', 'JOUEUR', 'VISITEUR');

-- CreateEnum
CREATE TYPE "CourtType" AS ENUM ('INTERIEUR', 'EXTERIEUR');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "sexe" BOOLEAN NOT NULL DEFAULT true,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "licence" TEXT,
    "phone" TEXT,
    "role" "Role" NOT NULL DEFAULT 'VISITER',
    "poste" "Poste" NOT NULL DEFAULT 'VISITEUR',
    "cotisationPayed" BOOLEAN NOT NULL DEFAULT false,
    "teamId" INTEGER,
    "resetToken" TEXT,
    "resetTokenExpiry" TIMESTAMP(3),
    "memberSince" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Court" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "type" "CourtType" NOT NULL DEFAULT 'INTERIEUR',

    CONSTRAINT "Court_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" SERIAL NOT NULL,
    "courtId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "dateDebut" TIMESTAMP(3) NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'confirmee',
    "bookedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Indisponibilite" (
    "id" SERIAL NOT NULL,
    "courtId" INTEGER NOT NULL,
    "dateDebut" TIMESTAMP(3) NOT NULL,
    "raison" TEXT,

    CONSTRAINT "Indisponibilite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "News" (
    "id" SERIAL NOT NULL,
    "titre" TEXT NOT NULL,
    "contenu" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,
    "adminId" INTEGER NOT NULL,
    "datePublication" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,
    "resultats" TEXT,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tournament" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "inscriptionsOuvertes" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Tournament_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_courtId_dateDebut_key" ON "Booking"("courtId", "dateDebut");

-- CreateIndex
CREATE UNIQUE INDEX "Team_nom_key" ON "Team"("nom");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_courtId_fkey" FOREIGN KEY ("courtId") REFERENCES "Court"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Indisponibilite" ADD CONSTRAINT "Indisponibilite_courtId_fkey" FOREIGN KEY ("courtId") REFERENCES "Court"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
