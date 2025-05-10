/*
  Warnings:

  - You are about to drop the column `course` on the `exams` table. All the data in the column will be lost.
  - The `answers` column on the `submissions` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "exams" DROP COLUMN "course";

-- AlterTable
ALTER TABLE "submissions" ADD COLUMN     "correct" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "incorrect" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "skipped" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "answers",
ADD COLUMN     "answers" TEXT[];
