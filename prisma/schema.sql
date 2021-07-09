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
CREATE TYPE ApplicantStatus as ENUM('ACTIVE', 'INACTIVE', 'DECEASED');

-- Create aid type enum
CREATE TYPE Aid as ENUM('CANE', 'ELECTRIC_CHAIR', 'MANUAL_CHAIR', 'SCOOTER', 'WALKER');

-- Create physician status enum
CREATE TYPE PhysicianStatus as ENUM('DECEASED', 'CANCELLED', 'RETIRED', 'ACTIVE', 'RESIGNED', 'TEMPORARILY_INACTIVE', 'RELOCATED');

-- Create gender enum
CREATE TYPE Gender as ENUM('MALE', 'FEMALE', 'OTHER');

-- Create employees table
CREATE TABLE employees (
  id                SERIAL PRIMARY KEY NOT NULL,
  first_name        VARCHAR(255) NOT NULL,
  last_name         VARCHAR(255) NOT NULL,
  email             VARCHAR(255) UNIQUE NOT NULL,
  email_verified    TIMESTAMPTZ,
  role              Role NOT NULL,
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
  first_name      VARCHAR(255) NOT NULL,
  last_name       VARCHAR(255) NOT NULL,
  msp_number      INTEGER UNIQUE NOT NULL,
  address_line_1  VARCHAR(255) NOT NULL,
  address_line_2  VARCHAR(255),
  city            VARCHAR(255) NOT NULL,
  province        Province NOT NULL,
  postal_code     CHAR(6) NOT NULL,
  phone           VARCHAR(50) NOT NULL,
  status          PhysicianStatus NOT NULL,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
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
  created_at                TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
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
  applicant_id    INTEGER UNIQUE NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(applicant_id) REFERENCES applicants(id)
);

-- Create medical information table
CREATE TABLE medical_information (
  id                       SERIAL PRIMARY KEY NOT NULL,
  disability               VARCHAR(255) NOT NULL,
  affects_mobility         BOOLEAN NOT NULL DEFAULT false,
  mobility_aid_required    BOOLEAN NOT NULL DEFAULT false,
  cannot_walk_100m         BOOLEAN NOT NULL DEFAULT false,
  notes                    TEXT,
  certification_date       DATE,
  aid                      Aid ARRAY,
  physician_id             INTEGER NOT NULL,
  applicant_id             INTEGER UNIQUE NOT NULL,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY(physician_id) REFERENCES physicians(id),
  FOREIGN KEY(applicant_id) REFERENCES applicants(id)
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
  province       Province NOT NULL,
  city           VARCHAR(255) NOT NULL,
  address_line_1 VARCHAR(255) NOT NULL,
  address_line_2 VARCHAR(255),
  postal_code    CHAR(6) NOT NULL,
  notes          TEXT,
  rcd_user_id    INTEGER,
  is_renewal     BOOLEAN NOT NULL DEFAULT true,
  poa_form_url   VARCHAR(255),
  applicant_id   INTEGER,
  -- Medical information
  disability               VARCHAR(255) NOT NULL,
  affects_mobility         BOOLEAN NOT NULL DEFAULT false,
  mobility_aid_required    BOOLEAN NOT NULL DEFAULT false,
  cannot_walk_100m         BOOLEAN NOT NULL DEFAULT false,
  aid                      Aid ARRAY,
  -- Physician information
  physician_name            VARCHAR(255) NOT NULL,
  physician_msp_number      INTEGER NOT NULL,
  physician_address_line_1  VARCHAR(255) NOT NULL,
  physician_address_line_2  VARCHAR(255),
  physician_city            VARCHAR(255) NOT NULL,
  physician_province        Province NOT NULL,
  physician_postal_code     CHAR(6) NOT NULL,
  physician_phone           VARCHAR(50) NOT NULL,
  physician_notes           TEXT,
  -- Payment information
  processing_fee                 FLOAT NOT NULL,
  donation_amount                FLOAT,
  payment_method                 PaymentType NOT NULL,
  shopify_confirmation_number    VARCHAR(255) UNIQUE NOT NULL,
  -- Guardian information
  guardian_first_name     VARCHAR(255),
  guardian_middle_name    VARCHAR(255),
  guardian_last_name      VARCHAR(255),
  guardian_phone          VARCHAR(50),
  guardian_province       Province,
  guardian_city           VARCHAR(255),
  guardian_address_line_1 VARCHAR(255),
  guardian_address_line_2 VARCHAR(255),
  guardian_postal_code    CHAR(6),
  guardian_relationship   VARCHAR(50),
  guardian_notes          TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(applicant_id) REFERENCES applicants(id)
);

-- Create permits table
CREATE TABLE permits (
  id                SERIAL PRIMARY KEY NOT NULL,
  rcd_permit_id     INTEGER NOT NULL UNIQUE,
  expiry_date       DATE NOT NULL,
  receipt_id        INTEGER,
  active            BOOLEAN NOT NULL DEFAULT true,
  application_id    INTEGER NOT NULL,
  applicant_id      INTEGER NOT NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY(application_id) REFERENCES applications(id),
  FOREIGN KEY(applicant_id) REFERENCES applicants(id)
);
