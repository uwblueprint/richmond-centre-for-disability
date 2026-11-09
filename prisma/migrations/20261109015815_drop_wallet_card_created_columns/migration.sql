/*
  Warnings:

  - You are about to drop the column `wallet_card_created` on the `application_processing` table. All the data in the column will be lost.
  - You are about to drop the column `wallet_card_created_employee_id` on the `application_processing` table. All the data in the column will be lost.
  - You are about to drop the column `wallet_card_created_updated_at` on the `application_processing` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "application_processing" DROP CONSTRAINT "application_processing_wallet_card_created_employee_id_fkey";

-- AlterTable
ALTER TABLE "application_processing" DROP COLUMN "wallet_card_created",
DROP COLUMN "wallet_card_created_employee_id",
DROP COLUMN "wallet_card_created_updated_at";
