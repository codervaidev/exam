-- AlterTable
ALTER TABLE "exams" ADD COLUMN     "negative_marking" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "shuffle_questions" BOOLEAN NOT NULL DEFAULT false;
