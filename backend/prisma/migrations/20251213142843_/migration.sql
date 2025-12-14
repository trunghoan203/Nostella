/*
  Warnings:

  - You are about to drop the column `codeExpiresAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verificationCode` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "codeExpiresAt",
DROP COLUMN "isVerified",
DROP COLUMN "verificationCode";
