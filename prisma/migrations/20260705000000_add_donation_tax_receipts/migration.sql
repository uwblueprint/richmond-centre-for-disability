-- Existing applications remain out of scope; new applications are enabled by default.
ALTER TABLE "applications"
ADD COLUMN "donation_tax_receipt_enabled" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "applications"
ADD COLUMN "donation_received_at" TIMESTAMPTZ(6);

ALTER TABLE "applications"
ALTER COLUMN "donation_tax_receipt_enabled" SET DEFAULT true;

CREATE TABLE "donation_tax_receipts" (
    "application_id" INTEGER NOT NULL,
    "receipt_number" VARCHAR(255) NOT NULL,
    "s3_object_key" VARCHAR(255),
    "s3_object_url" TEXT,
    "employee_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "donation_tax_receipts_pkey" PRIMARY KEY ("application_id")
);

CREATE UNIQUE INDEX "donation_tax_receipts_receipt_number_key"
ON "donation_tax_receipts"("receipt_number");

ALTER TABLE "donation_tax_receipts"
ADD CONSTRAINT "donation_tax_receipts_application_id_fkey"
FOREIGN KEY ("application_id") REFERENCES "applications"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "donation_tax_receipts"
ADD CONSTRAINT "donation_tax_receipts_employee_id_fkey"
FOREIGN KEY ("employee_id") REFERENCES "employees"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
