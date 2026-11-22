/*
  Warnings:

  - The primary key for the `SectionMember` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "SectionMember" DROP CONSTRAINT "SectionMember_pkey",
ADD CONSTRAINT "SectionMember_pkey" PRIMARY KEY ("userId");
