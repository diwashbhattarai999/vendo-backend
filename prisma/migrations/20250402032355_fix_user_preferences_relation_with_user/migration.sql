/*
  Warnings:

  - You are about to drop the column `userPreferencesId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_userPreferencesId_fkey";

-- DropIndex
DROP INDEX "User_userPreferencesId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "userPreferencesId";

-- AddForeignKey
ALTER TABLE "UserPreferences" ADD CONSTRAINT "UserPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
