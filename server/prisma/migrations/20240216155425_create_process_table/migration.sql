-- CreateEnum
CREATE TYPE "ProcessStatus" AS ENUM ('SUCCESS', 'FAIL', 'RUNNING');

-- CreateTable
CREATE TABLE "Process" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "pid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "workflowId" INTEGER NOT NULL,
    "status" "ProcessStatus" NOT NULL DEFAULT 'RUNNING',

    CONSTRAINT "Process_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Process" ADD CONSTRAINT "Process_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
