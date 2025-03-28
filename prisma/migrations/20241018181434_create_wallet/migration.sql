/*
  Warnings:

  - A unique constraint covering the columns `[wallet_number]` on the table `application_processing` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "application_processing" ADD COLUMN     "wallet_number" INTEGER;

-- CreateTable
CREATE TABLE "wallet_card" (
    "wallet_number" SERIAL NOT NULL,
    "s3_object_key" VARCHAR(255),
    "s3_object_url" TEXT,
    "employee_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("wallet_number")
);

-- CreateIndex
CREATE UNIQUE INDEX "application_processing.wallet_number_unique" ON "application_processing"("wallet_number");

-- AddForeignKey
ALTER TABLE "application_processing" ADD FOREIGN KEY ("wallet_number") REFERENCES "wallet_card"("wallet_number") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_card" ADD FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
