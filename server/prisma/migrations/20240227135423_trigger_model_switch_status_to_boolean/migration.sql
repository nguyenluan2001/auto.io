/*
  Warnings:

  - You are about to drop the column `status` on the `Trigger` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Trigger" DROP COLUMN "status",
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- DropEnum
DROP TYPE "TriggerStatus";
