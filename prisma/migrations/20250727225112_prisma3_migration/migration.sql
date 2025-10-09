-- DropForeignKey
ALTER TABLE "applicants" DROP CONSTRAINT "applicants_medical_information_id_fkey";

-- DropForeignKey
ALTER TABLE "application_invoices" DROP CONSTRAINT "application_invoices_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "applications" DROP CONSTRAINT "applications_application_processing_id_fkey";

-- DropForeignKey
ALTER TABLE "medical_information" DROP CONSTRAINT "medical_information_physician_msp_number_fkey";

-- DropForeignKey
ALTER TABLE "new_applications" DROP CONSTRAINT "new_applications_application_id_fkey";

-- DropForeignKey
ALTER TABLE "permits" DROP CONSTRAINT "permits_applicant_id_fkey";

-- DropForeignKey
ALTER TABLE "permits" DROP CONSTRAINT "permits_application_id_fkey";

-- DropForeignKey
ALTER TABLE "renewal_applications" DROP CONSTRAINT "renewal_applications_application_id_fkey";

-- DropForeignKey
ALTER TABLE "replacement_applications" DROP CONSTRAINT "replacement_applications_application_id_fkey";

-- DropForeignKey
ALTER TABLE "wallet_card" DROP CONSTRAINT "wallet_card_employee_id_fkey";

-- AddForeignKey
ALTER TABLE "applicants" ADD CONSTRAINT "applicants_medical_information_id_fkey" FOREIGN KEY ("medical_information_id") REFERENCES "medical_information"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_application_processing_id_fkey" FOREIGN KEY ("application_processing_id") REFERENCES "application_processing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_information" ADD CONSTRAINT "medical_information_physician_msp_number_fkey" FOREIGN KEY ("physician_msp_number") REFERENCES "physicians"("msp_number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permits" ADD CONSTRAINT "permits_applicant_id_fkey" FOREIGN KEY ("applicant_id") REFERENCES "applicants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permits" ADD CONSTRAINT "permits_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "new_applications" ADD CONSTRAINT "new_applications_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "renewal_applications" ADD CONSTRAINT "renewal_applications_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "replacement_applications" ADD CONSTRAINT "replacement_applications_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_invoices" ADD CONSTRAINT "application_invoices_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_card" ADD CONSTRAINT "wallet_card_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "applicants.guardian_id_unique" RENAME TO "applicants_guardian_id_key";

-- RenameIndex
ALTER INDEX "applicants.medical_information_id_unique" RENAME TO "applicants_medical_information_id_key";

-- RenameIndex
ALTER INDEX "application_processing.app_number_unique" RENAME TO "application_processing_app_number_key";

-- RenameIndex
ALTER INDEX "application_processing.invoice_number_unique" RENAME TO "application_processing_invoice_number_key";

-- RenameIndex
ALTER INDEX "application_processing.wallet_number_unique" RENAME TO "application_processing_wallet_number_key";

-- RenameIndex
ALTER INDEX "applications.application_processing_id_unique" RENAME TO "applications_application_processing_id_key";

-- RenameIndex
ALTER INDEX "applications.shopify_confirmation_number_unique" RENAME TO "applications_shopify_confirmation_number_key";

-- RenameIndex
ALTER INDEX "applications.shopify_order_number_unique" RENAME TO "applications_shopify_order_number_key";

-- RenameIndex
ALTER INDEX "employees.email_unique" RENAME TO "employees_email_key";

-- RenameIndex
ALTER INDEX "permits.application_id_unique" RENAME TO "permits_application_id_key";

-- RenameIndex
ALTER INDEX "verification_requests.token_unique" RENAME TO "verification_requests_token_key";
