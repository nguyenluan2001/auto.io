/*
  Warnings:

  - You are about to drop the column `title` on the `Workflows` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Workflows" DROP COLUMN "title",
ADD COLUMN     "config" JSONB NOT NULL,
ADD COLUMN     "name" VARCHAR(255) NOT NULL;
