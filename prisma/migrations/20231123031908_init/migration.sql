-- CreateEnum
CREATE TYPE "applicantstatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "paymenttype" AS ENUM ('MASTERCARD', 'VISA', 'ETRANSFER', 'CASH', 'CHEQUE', 'DEBIT', 'SHOPIFY');

-- CreateEnum
CREATE TYPE "physicianstatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "province" AS ENUM ('BC', 'AB', 'SK', 'MB', 'ON', 'QC', 'NS', 'PE', 'NL', 'NB', 'NU', 'NT', 'YT');

-- CreateEnum
CREATE TYPE "role" AS ENUM ('ADMIN', 'ACCOUNTING', 'SECRETARY');

-- CreateEnum
CREATE TYPE "applicationstatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'REJECTED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "reasonforreplacement" AS ENUM ('LOST', 'STOLEN', 'OTHER');

-- CreateEnum
CREATE TYPE "permittype" AS ENUM ('PERMANENT', 'TEMPORARY');

-- CreateEnum
CREATE TYPE "accessibleconvertedvanloadingmethod" AS ENUM ('SIDE_LOADING', 'END_LOADING');

-- CreateEnum
CREATE TYPE "applicationtype" AS ENUM ('NEW', 'RENEWAL', 'REPLACEMENT');

-- CreateEnum
CREATE TYPE "mobilityaid" AS ENUM ('CANE', 'ELECTRIC_CHAIR', 'MANUAL_CHAIR', 'SCOOTER', 'WALKER', 'CRUTCHES', 'OTHERS');

-- CreateEnum
CREATE TYPE "patientcondition" AS ENUM ('AFFECTS_MOBILITY', 'MOBILITY_AID_REQUIRED', 'CANNOT_WALK_100M', 'OTHER');

-- CreateEnum
CREATE TYPE "requireswiderparkingspacereason" AS ENUM ('HAS_ACCESSIBLE_VAN', 'MEDICAL_REASONS', 'OTHER');

-- CreateEnum
CREATE TYPE "shopifypaymentstatus" AS ENUM ('PENDING', 'RECEIVED');

-- CreateTable
CREATE TABLE "applicants" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "middle_name" VARCHAR(255),
    "last_name" VARCHAR(255) NOT NULL,
    "date_of_birth" DATE NOT NULL,
    "gender" "gender" NOT NULL,
    "other_gender" VARCHAR(255),
    "phone" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255),
    "receive_email_updates" BOOLEAN NOT NULL,
    "address_line_1" VARCHAR(255) NOT NULL,
    "address_line_2" VARCHAR(255),
    "city" VARCHAR(255) NOT NULL,
    "province" "province" NOT NULL DEFAULT E'BC',
    "country" VARCHAR(255) NOT NULL DEFAULT E'Canada',
    "postal_code" VARCHAR(6) NOT NULL,
    "status" "applicantstatus" NOT NULL DEFAULT E'ACTIVE',
    "inactive_reason" VARCHAR(255),
    "accepted_tos" TIMESTAMPTZ(6),
    "notes" TEXT,
    "guardian_id" INTEGER,
    "medical_information_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "middle_name" VARCHAR(255),
    "last_name" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255),
    "receive_email_updates" BOOLEAN NOT NULL DEFAULT false,
    "address_line_1" VARCHAR(255) NOT NULL,
    "address_line_2" VARCHAR(255),
    "city" VARCHAR(255) NOT NULL,
    "province" "province" NOT NULL DEFAULT E'BC',
    "country" VARCHAR(255) NOT NULL DEFAULT E'Canada',
    "postal_code" VARCHAR(6) NOT NULL,
    "permit_type" "permittype" NOT NULL DEFAULT E'PERMANENT',
    "payment_method" "paymenttype" NOT NULL,
    "processing_fee" MONEY NOT NULL,
    "donation_amount" MONEY NOT NULL DEFAULT 0.00,
    "second_payment_method" "paymenttype",
    "second_processing_fee" MONEY,
    "second_donation_amount" MONEY,
    "has_second_payment_method" BOOLEAN NOT NULL DEFAULT false,
    "paid_through_shopify" BOOLEAN NOT NULL DEFAULT false,
    "shopify_payment_status" "shopifypaymentstatus" DEFAULT E'PENDING',
    "shopify_confirmation_number" VARCHAR(255),
    "shopify_order_number" VARCHAR(255),
    "shipping_address_same_as_home_address" BOOLEAN NOT NULL,
    "shipping_full_name" VARCHAR(255),
    "shipping_address_line_1" VARCHAR(255),
    "shipping_address_line_2" VARCHAR(255),
    "shipping_city" VARCHAR(255),
    "shipping_province" "province",
    "shipping_country" VARCHAR(255),
    "shipping_postal_code" VARCHAR(6),
    "billing_address_same_as_home_address" BOOLEAN NOT NULL,
    "billing_full_name" VARCHAR(255),
    "billing_address_line_1" VARCHAR(255),
    "billing_address_line_2" VARCHAR(255),
    "billing_city" VARCHAR(255),
    "billing_province" "province",
    "billing_country" VARCHAR(255),
    "billing_postal_code" VARCHAR(6),
    "type" "applicationtype" NOT NULL,
    "notes" TEXT,
    "applicant_id" INTEGER,
    "application_processing_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "email_verified" TIMESTAMPTZ(6),
    "role" "role" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guardians" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "middle_name" VARCHAR(255),
    "last_name" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(50) NOT NULL,
    "address_line_1" VARCHAR(255) NOT NULL,
    "address_line_2" VARCHAR(255),
    "city" VARCHAR(255) NOT NULL,
    "province" "province" NOT NULL DEFAULT E'BC',
    "country" VARCHAR(255) NOT NULL DEFAULT E'Canada',
    "postal_code" VARCHAR(6) NOT NULL,
    "relationship" VARCHAR(255) NOT NULL,
    "poa_form_s3_object_key" VARCHAR(255),
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical_information" (
    "id" SERIAL NOT NULL,
    "disability" VARCHAR(255) NOT NULL,
    "disability_certification_date" DATE NOT NULL,
    "patient_condition" "patientcondition"[],
    "mobility_aids" "mobilityaid"[],
    "other_patient_condition" VARCHAR(255),
    "notes" TEXT,
    "physician_msp_number" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permits" (
    "rcd_permit_id" INTEGER NOT NULL,
    "type" "permittype" NOT NULL,
    "expiry_date" DATE NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "application_id" INTEGER NOT NULL,
    "applicant_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("rcd_permit_id")
);

-- CreateTable
CREATE TABLE "physicians" (
    "msp_number" VARCHAR(50) NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(50) NOT NULL,
    "address_line_1" VARCHAR(255) NOT NULL,
    "address_line_2" VARCHAR(255),
    "city" VARCHAR(255) NOT NULL,
    "province" "province" NOT NULL DEFAULT E'BC',
    "country" VARCHAR(255) NOT NULL DEFAULT E'Canada',
    "postal_code" VARCHAR(6) NOT NULL,
    "status" "physicianstatus" NOT NULL DEFAULT E'ACTIVE',
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("msp_number")
);

-- CreateTable
CREATE TABLE "verification_requests" (
    "id" SERIAL NOT NULL,
    "identifier" VARCHAR(255) NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "expires" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_processing" (
    "id" SERIAL NOT NULL,
    "status" "applicationstatus" NOT NULL DEFAULT E'PENDING',
    "rejected_reason" VARCHAR(255),
    "app_number" INTEGER,
    "app_number_employee_id" INTEGER,
    "app_number_updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "app_holepunched" BOOLEAN NOT NULL DEFAULT false,
    "app_holepunched_employee_id" INTEGER,
    "app_holepunched_updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "wallet_card_created" BOOLEAN NOT NULL DEFAULT false,
    "wallet_card_created_employee_id" INTEGER,
    "wallet_card_created_updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "review_request_completed" BOOLEAN NOT NULL DEFAULT false,
    "review_request_completed_employee_id" INTEGER,
    "review_request_completed_updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "invoice_number" INTEGER,
    "documents_s3_object_key" TEXT,
    "documents_url_employee_id" INTEGER,
    "documents_url_updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "app_mailed" BOOLEAN NOT NULL DEFAULT false,
    "app_mailed_employee_id" INTEGER,
    "app_mailed_updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payment_refunded" BOOLEAN NOT NULL DEFAULT false,
    "payment_refunded_employee_id" INTEGER,
    "payment_refunded_updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "new_applications" (
    "application_id" INTEGER NOT NULL,
    "date_of_birth" DATE NOT NULL,
    "gender" "gender" NOT NULL,
    "other_gender" VARCHAR(255),
    "disability" VARCHAR(255) NOT NULL,
    "disability_certification_date" DATE NOT NULL,
    "patient_condition" "patientcondition"[],
    "mobility_aids" "mobilityaid"[],
    "other_mobility_aids" VARCHAR(255),
    "other_patient_condition" VARCHAR(255),
    "temporary_permit_expiry" DATE,
    "physician_first_name" VARCHAR(255) NOT NULL,
    "physician_last_name" VARCHAR(255) NOT NULL,
    "physician_msp_number" VARCHAR(50) NOT NULL,
    "physician_phone" VARCHAR(50) NOT NULL,
    "physician_address_line_1" VARCHAR(255) NOT NULL,
    "physician_address_line_2" VARCHAR(255),
    "physician_city" VARCHAR(255) NOT NULL,
    "physician_province" "province" NOT NULL DEFAULT E'BC',
    "physician_country" VARCHAR(255) NOT NULL DEFAULT E'Canada',
    "physician_postal_code" VARCHAR(6) NOT NULL,
    "guardian_first_name" VARCHAR(255),
    "guardian_middle_name" VARCHAR(255),
    "guardian_last_name" VARCHAR(255),
    "guardian_phone" VARCHAR(50),
    "guardian_relationship" VARCHAR(50),
    "guardian_address_line_1" VARCHAR(255),
    "guardian_address_line_2" VARCHAR(255),
    "guardian_city" VARCHAR(255),
    "guardian_province" "province" DEFAULT E'BC',
    "guardian_country" VARCHAR(255) DEFAULT E'Canada',
    "guardian_postal_code" VARCHAR(6),
    "poa_form_s3_object_key" VARCHAR(255),
    "uses_accessible_converted_van" BOOLEAN NOT NULL,
    "accessible_converted_van_loading_method" "accessibleconvertedvanloadingmethod",
    "requires_wider_parking_space" BOOLEAN NOT NULL,
    "requires_wider_parking_space_reason" "requireswiderparkingspacereason",
    "other_requires_wider_parking_space_reason" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("application_id")
);

-- CreateTable
CREATE TABLE "renewal_applications" (
    "application_id" INTEGER NOT NULL,
    "physician_first_name" VARCHAR(255) NOT NULL,
    "physician_last_name" VARCHAR(255) NOT NULL,
    "physician_msp_number" VARCHAR(50) NOT NULL,
    "physician_phone" VARCHAR(50) NOT NULL,
    "physician_address_line_1" VARCHAR(255) NOT NULL,
    "physician_address_line_2" VARCHAR(255),
    "physician_city" VARCHAR(255) NOT NULL,
    "physician_province" "province" NOT NULL DEFAULT E'BC',
    "physician_country" VARCHAR(255) NOT NULL DEFAULT E'Canada',
    "physician_postal_code" VARCHAR(6) NOT NULL,
    "uses_accessible_converted_van" BOOLEAN NOT NULL,
    "accessible_converted_van_loading_method" "accessibleconvertedvanloadingmethod",
    "requires_wider_parking_space" BOOLEAN NOT NULL,
    "requires_wider_parking_space_reason" "requireswiderparkingspacereason",
    "other_requires_wider_parking_space_reason" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("application_id")
);

-- CreateTable
CREATE TABLE "replacement_applications" (
    "application_id" INTEGER NOT NULL,
    "reason" "reasonforreplacement" NOT NULL,
    "lost_timestamp" TIMESTAMPTZ(6),
    "lost_location" VARCHAR(255),
    "stolen_police_file_number" INTEGER,
    "stolen_jurisdiction" VARCHAR(255),
    "stolen_police_officer_name" VARCHAR(255),
    "event_description" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("application_id")
);

-- CreateTable
CREATE TABLE "application_invoices" (
    "invoice_number" SERIAL NOT NULL,
    "s3_object_key" VARCHAR(255),
    "s3_object_url" TEXT,
    "employee_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("invoice_number")
);

-- CreateIndex
CREATE UNIQUE INDEX "applicants.guardian_id_unique" ON "applicants"("guardian_id");

-- CreateIndex
CREATE UNIQUE INDEX "applicants.medical_information_id_unique" ON "applicants"("medical_information_id");

-- CreateIndex
CREATE UNIQUE INDEX "applications.shopify_confirmation_number_unique" ON "applications"("shopify_confirmation_number");

-- CreateIndex
CREATE UNIQUE INDEX "applications.shopify_order_number_unique" ON "applications"("shopify_order_number");

-- CreateIndex
CREATE UNIQUE INDEX "applications.application_processing_id_unique" ON "applications"("application_processing_id");

-- CreateIndex
CREATE UNIQUE INDEX "employees.email_unique" ON "employees"("email");

-- CreateIndex
CREATE UNIQUE INDEX "permits.application_id_unique" ON "permits"("application_id");

-- CreateIndex
CREATE UNIQUE INDEX "verification_requests.token_unique" ON "verification_requests"("token");

-- CreateIndex
CREATE UNIQUE INDEX "application_processing.app_number_unique" ON "application_processing"("app_number");

-- CreateIndex
CREATE UNIQUE INDEX "application_processing.invoice_number_unique" ON "application_processing"("invoice_number");

-- AddForeignKey
ALTER TABLE "applicants" ADD FOREIGN KEY ("guardian_id") REFERENCES "guardians"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applicants" ADD FOREIGN KEY ("medical_information_id") REFERENCES "medical_information"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD FOREIGN KEY ("applicant_id") REFERENCES "applicants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD FOREIGN KEY ("application_processing_id") REFERENCES "application_processing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_information" ADD FOREIGN KEY ("physician_msp_number") REFERENCES "physicians"("msp_number") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permits" ADD FOREIGN KEY ("applicant_id") REFERENCES "applicants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permits" ADD FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_processing" ADD FOREIGN KEY ("app_holepunched_employee_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_processing" ADD FOREIGN KEY ("app_mailed_employee_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_processing" ADD FOREIGN KEY ("app_number_employee_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_processing" ADD FOREIGN KEY ("documents_url_employee_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_processing" ADD FOREIGN KEY ("invoice_number") REFERENCES "application_invoices"("invoice_number") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_processing" ADD FOREIGN KEY ("payment_refunded_employee_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_processing" ADD FOREIGN KEY ("review_request_completed_employee_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_processing" ADD FOREIGN KEY ("wallet_card_created_employee_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "new_applications" ADD FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "renewal_applications" ADD FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "replacement_applications" ADD FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_invoices" ADD FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
