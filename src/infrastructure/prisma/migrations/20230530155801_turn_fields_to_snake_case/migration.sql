/*
  Warnings:

  - You are about to drop the column `isEmailVerified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isPhoneVerified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastVerificationTry` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `verificationAttempts` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "isEmailVerified",
DROP COLUMN "isPhoneVerified",
DROP COLUMN "lastVerificationTry",
DROP COLUMN "verificationAttempts",
ADD COLUMN     "is_email_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_phone_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "last_verification_try" TIMESTAMP(3),
ADD COLUMN     "verification_attempts" INTEGER NOT NULL DEFAULT 0;
