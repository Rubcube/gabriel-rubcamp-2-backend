/*
  Warnings:

  - Changed the type of `birthday` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "internal_transfers" ALTER COLUMN "scheduled_to" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "birthday",
ADD COLUMN     "birthday" DATE NOT NULL;
