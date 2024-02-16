/*
  Warnings:

  - The values [FAIL] on the enum `ProcessStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProcessStatus_new" AS ENUM ('SUCCESS', 'FAILED', 'CANCELED', 'RUNNING');
ALTER TABLE "Process" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Process" ALTER COLUMN "status" TYPE "ProcessStatus_new" USING ("status"::text::"ProcessStatus_new");
ALTER TYPE "ProcessStatus" RENAME TO "ProcessStatus_old";
ALTER TYPE "ProcessStatus_new" RENAME TO "ProcessStatus";
DROP TYPE "ProcessStatus_old";
ALTER TABLE "Process" ALTER COLUMN "status" SET DEFAULT 'RUNNING';
COMMIT;
