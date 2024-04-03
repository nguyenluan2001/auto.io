-- CreateTable
CREATE TABLE "Connection" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "token" JSONB NOT NULL DEFAULT '{}',
    "profile" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Connection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Connection_userId_key" ON "Connection"("userId");

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
