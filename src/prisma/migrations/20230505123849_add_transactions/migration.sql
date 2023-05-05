/*
  Warnings:

  - Added the required column `status` to the `accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('OPEN', 'CLOSED', 'PENDING_APPROVAL', 'BLOCKED');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('VOID', 'CONFIRMED', 'CANCELED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TransactionTypes" AS ENUM ('INTERNAL_TRANSFER_INBOUND', 'INTERNAL_TRANSFER_OUTBOUND');

-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "status" "AccountStatus" NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "address_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "transations" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" "TransactionStatus" NOT NULL,
    "type" "TransactionTypes" NOT NULL,
    "account_id" TEXT NOT NULL,
    "source_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "transations" ADD CONSTRAINT "transations_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
