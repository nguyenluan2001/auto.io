-- AlterTable
ALTER TABLE "Workflows" ADD COLUMN     "tableId" INTEGER;

-- AddForeignKey
ALTER TABLE "Workflows" ADD CONSTRAINT "Workflows_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "Table"("id") ON DELETE SET NULL ON UPDATE CASCADE;
