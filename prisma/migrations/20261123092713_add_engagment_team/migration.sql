/*
  Warnings:

  - You are about to drop the column `categorie` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `nom` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `resultats` on the `Team` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `matchDay` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Team_nom_key";

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "categorie",
DROP COLUMN "nom",
DROP COLUMN "resultats",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "isEngaged" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "matchDay" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "results" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");
