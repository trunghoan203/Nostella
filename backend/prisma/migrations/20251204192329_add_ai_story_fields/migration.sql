-- AlterTable
ALTER TABLE "Photo" ADD COLUMN     "hasAiStory" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "story" TEXT;
