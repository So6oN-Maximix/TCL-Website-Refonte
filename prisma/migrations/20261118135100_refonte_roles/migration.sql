/*
  Warnings:

  - You are about to drop the column `poste` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - Added the required column `createdUserId` to the `Indisponibilite` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SectionRole" AS ENUM ('DEVELOPPEUR', 'PRESIDENT', 'PRESIDENTE', 'VICE_PRESIDENT', 'VICE_PRESIDENTE', 'TRESORIER', 'TRESORIERE', 'SECRETAIRE', 'COACH', 'MEMBRE', 'VISITEUR');

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_courtId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_userId_fkey";

-- DropForeignKey
ALTER TABLE "Indisponibilite" DROP CONSTRAINT "Indisponibilite_courtId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_teamId_fkey";

-- AlterTable
ALTER TABLE "Indisponibilite" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdUserId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "poste",
DROP COLUMN "role";

-- DropEnum
DROP TYPE "Poste";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "Section" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SectionMember" (
    "userId" INTEGER NOT NULL,
    "sectionId" INTEGER NOT NULL,
    "role" "SectionRole" NOT NULL DEFAULT 'MEMBRE',

    CONSTRAINT "SectionMember_pkey" PRIMARY KEY ("userId","sectionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Section_nom_key" ON "Section"("nom");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionMember" ADD CONSTRAINT "SectionMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionMember" ADD CONSTRAINT "SectionMember_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_courtId_fkey" FOREIGN KEY ("courtId") REFERENCES "Court"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Indisponibilite" ADD CONSTRAINT "Indisponibilite_courtId_fkey" FOREIGN KEY ("courtId") REFERENCES "Court"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Indisponibilite" ADD CONSTRAINT "Indisponibilite_createdUserId_fkey" FOREIGN KEY ("createdUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
