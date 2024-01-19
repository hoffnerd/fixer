/*
  Warnings:

  - You are about to drop the `SaveFiles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SaveFiles" DROP CONSTRAINT "SaveFiles_userId_fkey";

-- DropTable
DROP TABLE "SaveFiles";

-- CreateTable
CREATE TABLE "SaveFile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "chapter" INTEGER NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'Story',
    "saveData" JSONB,
    "inGameTime" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SaveFile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SaveFile" ADD CONSTRAINT "SaveFile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
