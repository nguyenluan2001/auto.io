/*
  Warnings:

  - Added the required column `scheduleId` to the `Trigger` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Trigger" ADD COLUMN     "scheduleId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Trigger" ADD CONSTRAINT "Trigger_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
