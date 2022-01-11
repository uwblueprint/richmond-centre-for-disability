-- Create user roles
CREATE TYPE Role as ENUM('ADMIN', 'ACCOUNTING', 'SECRETARY');

-- Create province enum

CREATE TYPE Province as ENUM(
  'BC',
  'AB',
  'SK',
  'MB',
  'ON',
  'QC',
  'NS',
  'PE',
  'NL',
  'NB',
  'NU',
  'NT',
  'YT'
);

-- Create payment type enum
CREATE TYPE PaymentType as ENUM('MASTERCARD', 'VISA', 'ETRANSFER', 'CASH', 'CHEQUE', 'DEBIT', 'MONEY_ORDER');

-- Create applicant status enum
CREATE TYPE ApplicantStatus as ENUM('ACTIVE', 'INACTIVE');

-- Create aid type enum
CREATE TYPE Aid as ENUM('CANE', 'ELECTRIC_CHAIR', 'MANUAL_CHAIR', 'SCOOTER', 'WALKER');

-- Create physician status enum
CREATE TYPE PhysicianStatus as ENUM('ACTIVE', 'INACTIVE');

-- Create gender enum
CREATE TYPE Gender as ENUM('MALE', 'FEMALE', 'OTHER');

-- Create application status enum
CREATE TYPE ApplicationStatus as ENUM('PENDING', 'INPROGRESS', 'APPROVED', 'REJECTED', 'COMPLETED', 'EXPIRING', 'EXPIRED', 'ACTIVE');

-- Create reason for replacement enum
CREATE TYPE ReasonForReplacement as ENUM('LOST', 'STOLEN', 'OTHER');

-- Create permit type enum
CREATE TYPE PermitType as ENUM('PERMANENT', 'TEMPORARY');

-- Create payment status enum
CREATE TYPE PaymentStatus as ENUM('PENDING', 'COMPLETED');

-- Create eligibility type enum
CREATE TYPE Eligibility as ENUM(
  'AFFECTS_MOBILITY',
  'MOBILITY_AID_REQUIRED',
  'CANNOT_WALK_100M',
  'OTHER'
);

-- Create employees table
CREATE TABLE employees (
  id                SERIAL PRIMARY KEY NOT NULL,
  first_name        VARCHAR(255) NOT NULL,
  last_name         VARCHAR(255) NOT NULL,
  email             VARCHAR(255) UNIQUE NOT NULL,
  email_verified    TIMESTAMPTZ,
  role              Role NOT NULL,
  active            BOOLEAN NOT NULL DEFAULT true,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create email verification requests table
CREATE TABLE verification_requests (
  id            SERIAL PRIMARY KEY NOT NULL,
  identifier    VARCHAR(255) NOT NULL,
  token         VARCHAR(255) NOT NULL UNIQUE,
  expires       TIMESTAMPTZ NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create physicians table
CREATE TABLE physicians (
  id              SERIAL PRIMARY KEY NOT NULL,
  name            VARCHAR(255) NOT NULL,
  msp_number      INTEGER UNIQUE NOT NULL,
  address_line_1  VARCHAR(255) NOT NULL,
  address_line_2  VARCHAR(255),
  city            VARCHAR(255) NOT NULL,
  province        Province NOT NULL DEFAULT 'BC',
  postal_code     CHAR(6) NOT NULL,
  phone           VARCHAR(50) NOT NULL,
  status          PhysicianStatus NOT NULL DEFAULT 'ACTIVE',
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create guardians table
CREATE TABLE guardians (
  id              SERIAL PRIMARY KEY NOT NULL,
  first_name      VARCHAR(255) NOT NULL,
  middle_name     VARCHAR(255),
  last_name       VARCHAR(255) NOT NULL,
  address_line_1  VARCHAR(255) NOT NULL,
  address_line_2  VARCHAR(255),
  city            VARCHAR(255) NOT NULL,
  province        Province NOT NULL,
  postal_code     CHAR(6) NOT NULL,
  phone           VARCHAR(50) NOT NULL,
  relationship    VARCHAR(255) NOT NULL,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create medical information table
CREATE TABLE medical_information (
  id                       SERIAL PRIMARY KEY NOT NULL,
  disability               VARCHAR(255) NOT NULL,
  patient_eligibility      Eligibility NOT NULL,
  notes                    TEXT,
  certification_date       DATE,
  aid                      Aid ARRAY,
  physician_id             INTEGER NOT NULL,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY(physician_id) REFERENCES physicians(id)
);

-- Create applicants table
CREATE TABLE applicants (
  id                        SERIAL PRIMARY KEY NOT NULL,
  first_name                VARCHAR(255) NOT NULL,
  middle_name               VARCHAR(255),
  last_name                 VARCHAR(255) NOT NULL,
  date_of_birth             DATE NOT NULL,
  gender                    Gender NOT NULL,
  custom_gender             VARCHAR(255),
  email                     VARCHAR(255) UNIQUE,
  phone                     VARCHAR(50) NOT NULL,
  province                  Province NOT NULL,
  city                      VARCHAR(255) NOT NULL,
  address_line_1            VARCHAR(255) NOT NULL,
  address_line_2            VARCHAR(255),
  postal_code               CHAR(6) NOT NULL,
  rcd_user_id               INTEGER UNIQUE,
  status                    ApplicantStatus,
  inactive_reason           VARCHAR(255),
  accepted_tos              TIMESTAMPTZ,
  guardian_id               INTEGER UNIQUE,
  medical_information_id    INTEGER UNIQUE NOT NULL,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY(guardian_id) REFERENCES guardians(id),
  FOREIGN KEY(medical_information_id) REFERENCES medical_information(id)
);

-- Create application processing table
CREATE TABLE application_processing (
  id                  SERIAL PRIMARY KEY NOT NULL,
  status              ApplicationStatus NOT NULL DEFAULT 'PENDING',
  payment_status      PaymentStatus NOT NULL DEFAULT 'PENDING',
  app_number          INTEGER UNIQUE,
  app_holepunched     BOOLEAN NOT NULL DEFAULT false,
  wallet_card_created BOOLEAN NOT NULL DEFAULT false,
  invoice_number      INTEGER UNIQUE,
  document_urls       VARCHAR(255) ARRAY,
  app_mailed          BOOLEAN NOT NULL DEFAULT false,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create applications table
CREATE TABLE applications (
  -- Applicant information
  id             SERIAL PRIMARY KEY NOT NULL,
  first_name     VARCHAR(255) NOT NULL,
  middle_name    VARCHAR(255),
  last_name      VARCHAR(255) NOT NULL,
  date_of_birth  DATE NOT NULL,
  gender         Gender NOT NULL,
  custom_gender  VARCHAR(255),
  email          VARCHAR(255),
  phone          VARCHAR(50) NOT NULL,
  city           VARCHAR(255) NOT NULL,
  province       Province NOT NULL DEFAULT 'BC',
  address_line_1 VARCHAR(255) NOT NULL,
  address_line_2 VARCHAR(255),
  postal_code    CHAR(6) NOT NULL,
  notes          TEXT,
  rcd_user_id    INTEGER,
  is_renewal     BOOLEAN NOT NULL DEFAULT true,
  receive_email_updates BOOLEAN NOT NULL DEFAULT false,
  applicant_id   INTEGER,
  -- Medical information
  disability               VARCHAR(255) NOT NULL,
  certification_date       DATE,
  patient_eligibility      Eligibility NOT NULL,
  description              TEXT,
  expiry_date              DATE,
  permit_type              PermitType NOT NULL DEFAULT 'PERMANENT',
  aid                      Aid ARRAY,
  -- Physician information
  physician_name            VARCHAR(255) NOT NULL,
  physician_msp_number      INTEGER NOT NULL,
  physician_phone           VARCHAR(50) NOT NULL,
  physician_address_line_1  VARCHAR(255) NOT NULL,
  physician_address_line_2  VARCHAR(255),
  physician_city            VARCHAR(255) NOT NULL,
  physician_province        Province NOT NULL DEFAULT 'BC',
  physician_postal_code     CHAR(6) NOT NULL,
  physician_notes           TEXT,
  -- Guardian information
  guardian_first_name     VARCHAR(255),
  guardian_middle_name    VARCHAR(255),
  guardian_last_name      VARCHAR(255),
  guardian_phone          VARCHAR(50),
  guardian_relationship   VARCHAR(50),
  guardian_address_line_1 VARCHAR(255),
  guardian_address_line_2 VARCHAR(255),
  guardian_city           VARCHAR(255),
  guardian_province       Province,
  guardian_postal_code    CHAR(6),
  poa_form_url            VARCHAR(255),
  guardian_notes          TEXT,
  -- Additional Information
  uses_accessible_converted_van BOOLEAN DEFAULT FALSE,
  requires_wider_parking_space  BOOLEAN DEFAULT FALSE, 
  -- Payment information
  processing_fee                 FLOAT NOT NULL,
  donation_amount                FLOAT,
  payment_method                 PaymentType NOT NULL,
  shopify_confirmation_number    VARCHAR(255) UNIQUE,
  -- Billing and shipping information
  shipping_full_name                       VARCHAR(255),
  shipping_address_line_1                  VARCHAR(255),
  shipping_address_line_2                  VARCHAR(255),
  shipping_city                            VARCHAR(255),
  shipping_province                        Province,
  shipping_postal_code                     CHAR(6),
  shipping_address_same_as_home_address    BOOLEAN NOT NULL DEFAULT false,
  billing_address_same_as_home_address     BOOLEAN NOT NULL DEFAULT false,
  billing_full_name                        VARCHAR(255),
  billing_address_line_1                   VARCHAR(255),
  billing_address_line_2                   VARCHAR(255),
  billing_city                             VARCHAR(255),
  billing_province                         Province,
  billing_postal_code                      CHAR(6),
  -- Application processing information
  application_processing_id INTEGER UNIQUE NOT NULL,

  created_at              TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY(applicant_id) REFERENCES applicants(id),
  FOREIGN KEY(application_processing_id) REFERENCES application_processing(id)
);

-- Create permits table
CREATE TABLE permits (
  id                SERIAL PRIMARY KEY NOT NULL,
  rcd_permit_id     INTEGER NOT NULL UNIQUE,
  expiry_date       DATE NOT NULL,
  receipt_id        INTEGER,
  active            BOOLEAN NOT NULL DEFAULT true,
  application_id    INTEGER NOT NULL UNIQUE,
  applicant_id      INTEGER NOT NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY(application_id) REFERENCES applications(id),
  FOREIGN KEY(applicant_id) REFERENCES applicants(id)
);

-- Create replacements table (subset of applications)
CREATE TABLE replacements (
  id                         SERIAL PRIMARY KEY NOT NULL,
  reason                     ReasonForReplacement NOT NULL,
  lost_timestamp             TIMESTAMPTZ,
  lost_location              VARCHAR(255),
  stolen_police_file_number  INTEGER,
  stolen_jurisdiction        VARCHAR(255),
  stolen_police_officer_name VARCHAR(255),
  description                TEXT,
  application_id             INTEGER UNIQUE NOT NULL,
  created_at                 TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at                 TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY(application_id) REFERENCES applications(id)
);

-- Create renewals table (subset of applications)
CREATE TABLE renewals (
  id                             SERIAL PRIMARY KEY NOT NULL,
  uses_accessible_converted_van  BOOLEAN DEFAULT FALSE,
  requires_wider_parking_space   BOOLEAN DEFAULT FALSE,
  application_id                 INTEGER UNIQUE NOT NULL,
  created_at                     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at                     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY(application_id) REFERENCES applications(id)
);
