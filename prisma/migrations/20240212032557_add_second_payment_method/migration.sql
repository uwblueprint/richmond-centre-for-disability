-- AlterTable
ALTER TABLE "applications" ADD COLUMN     "has_second_payment_method" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "second_donation_amount" MONEY,
ADD COLUMN     "second_payment_method" "paymenttype",
ADD COLUMN     "second_processing_fee" MONEY;
