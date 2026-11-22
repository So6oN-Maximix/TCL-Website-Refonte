/*
  Warnings:

  - You are about to drop the `SectionMember` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SectionMember" DROP CONSTRAINT "SectionMember_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "SectionMember" DROP CONSTRAINT "SectionMember_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "SectionRole" NOT NULL DEFAULT 'VISITEUR',
ADD COLUMN     "sectionId" INTEGER;

-- DropTable
DROP TABLE "SectionMember";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;
