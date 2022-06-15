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
CREATE TYPE PaymentType as ENUM(
  'MASTERCARD',
  'VISA',
  'ETRANSFER',
  'CASH',
  'CHEQUE',
  'DEBIT',
  'SHOPIFY'
);

-- Create applicant status enum
CREATE TYPE ApplicantStatus as ENUM('ACTIVE', 'INACTIVE');

-- Create mobility aid enum
CREATE TYPE MobilityAid as ENUM(
  'CANE',
  'ELECTRIC_CHAIR',
  'MANUAL_CHAIR',
  'SCOOTER',
  'WALKER',
  'CRUTCHES',
  'OTHERS'
);

-- Create physician status enum
CREATE TYPE PhysicianStatus as ENUM('ACTIVE', 'INACTIVE');

-- Create gender enum
CREATE TYPE Gender as ENUM('MALE', 'FEMALE', 'OTHER');

-- Create application status enum
CREATE TYPE ApplicationStatus as ENUM(
  'PENDING',
  'IN_PROGRESS',
  'REJECTED',
  'COMPLETED'
);

-- Create reason for replacement enum
CREATE TYPE ReasonForReplacement as ENUM('LOST', 'STOLEN', 'OTHER');

-- Create permit type enum
CREATE TYPE PermitType as ENUM('PERMANENT', 'TEMPORARY');

-- Create patient disability condition type enum
CREATE TYPE PatientCondition as ENUM(
  'AFFECTS_MOBILITY',
  'MOBILITY_AID_REQUIRED',
  'CANNOT_WALK_100M',
  'OTHER'
);

-- Create application type enum
CREATE TYPE ApplicationType as ENUM('NEW', 'RENEWAL', 'REPLACEMENT');

-- Accessible converted van loading method enum
CREATE TYPE AccessibleConvertedVanLoadingMethod as ENUM('SIDE_LOADING', 'END_LOADING');

-- Reason for requiring a wider accessible parking space enum
CREATE TYPE RequiresWiderParkingSpaceReason as ENUM(
  'HAS_ACCESSIBLE_VAN',
  'MEDICAL_REASONS',
  'OTHER'
);

-- Shopify payment status enum
CREATE TYPE ShopifyPaymentStatus as ENUM(
  'PENDING',
  'RECEIVED'
);

-- Create employees table
CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  email_verified TIMESTAMPTZ,
  role Role NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create email verification requests table
CREATE TABLE verification_requests (
  id SERIAL PRIMARY KEY,
  identifier VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create physicians table
CREATE TABLE physicians (
  msp_number VARCHAR(50) UNIQUE NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  address_line_1 VARCHAR(255) NOT NULL,
  address_line_2 VARCHAR(255),
  city VARCHAR(255) NOT NULL,
  province Province NOT NULL DEFAULT 'BC',
  country VARCHAR(255) NOT NULL DEFAULT 'Canada',
  postal_code VARCHAR(6) NOT NULL,
  status PhysicianStatus NOT NULL DEFAULT 'ACTIVE',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY(msp_number)
);

-- Create guardians table
CREATE TABLE guardians (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  middle_name VARCHAR(255),
  last_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  address_line_1 VARCHAR(255) NOT NULL,
  address_line_2 VARCHAR(255),
  city VARCHAR(255) NOT NULL,
  province Province NOT NULL DEFAULT 'BC',
  country VARCHAR(255) NOT NULL DEFAULT 'Canada',
  postal_code VARCHAR(6) NOT NULL,
  relationship VARCHAR(255) NOT NULL,
  poa_form_s3_object_key VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create medical information table
CREATE TABLE medical_information (
  id SERIAL PRIMARY KEY,
  disability VARCHAR(255) NOT NULL,
  disability_certification_date DATE NOT NULL,
  patient_condition PatientCondition NOT NULL,
  mobility_aids MobilityAid ARRAY,
  other_patient_condition VARCHAR(255),
  notes TEXT,
  physician_msp_number VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY(physician_msp_number) REFERENCES physicians(msp_number)
);

-- Create applicants table
CREATE TABLE applicants (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  middle_name VARCHAR(255),
  last_name VARCHAR(255) NOT NULL,
  date_of_birth DATE NOT NULL,
  gender Gender NOT NULL,
  other_gender VARCHAR(255),
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  receive_email_updates BOOLEAN NOT NULL,
  address_line_1 VARCHAR(255) NOT NULL,
  address_line_2 VARCHAR(255),
  city VARCHAR(255) NOT NULL,
  province Province NOT NULL DEFAULT 'BC',
  country VARCHAR(255) NOT NULL DEFAULT 'Canada',
  postal_code VARCHAR(6) NOT NULL,
  status ApplicantStatus NOT NULL DEFAULT 'ACTIVE',
  inactive_reason VARCHAR(255),
  accepted_tos TIMESTAMPTZ,
  notes TEXT,
  guardian_id INTEGER UNIQUE,
  medical_information_id INTEGER UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY(guardian_id) REFERENCES guardians(id) ON DELETE SET NULL,
  FOREIGN KEY(medical_information_id) REFERENCES medical_information(id)
);

-- Create application_invoices table
CREATE TABLE application_invoices (
  invoice_number SERIAL PRIMARY KEY,
  s3_object_key VARCHAR(255),
  s3_object_url TEXT,
  employee_id INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY(employee_id) REFERENCES employees(id)
);

-- Create application processing table
CREATE TABLE application_processing (
  id SERIAL PRIMARY KEY,
  status ApplicationStatus NOT NULL DEFAULT 'PENDING',
  rejected_reason VARCHAR(255),
  app_number INTEGER UNIQUE,
  app_number_employee_id INTEGER,
  app_number_updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  app_holepunched BOOLEAN NOT NULL DEFAULT false,
  app_holepunched_employee_id INTEGER,
  app_holepunched_updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  wallet_card_created BOOLEAN NOT NULL DEFAULT false,
  wallet_card_created_employee_id INTEGER,
  wallet_card_created_updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  review_request_completed BOOLEAN NOT NULL DEFAULT false,
  review_request_completed_employee_id INTEGER,
  review_request_completed_updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  invoice_number INTEGER UNIQUE,
  documents_s3_object_key TEXT,
  documents_url_employee_id INTEGER,
  documents_url_updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  app_mailed BOOLEAN NOT NULL DEFAULT false,
  app_mailed_employee_id INTEGER,
  app_mailed_updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY(app_number_employee_id) REFERENCES employees(id),
  FOREIGN KEY(app_holepunched_employee_id) REFERENCES employees(id),
  FOREIGN KEY(wallet_card_created_employee_id) REFERENCES employees(id),
  FOREIGN KEY(review_request_completed_employee_id) REFERENCES employees(id),
  FOREIGN KEY(invoice_number) REFERENCES application_invoices(invoice_number),
  FOREIGN KEY(documents_url_employee_id) REFERENCES employees(id),
  FOREIGN KEY(app_mailed_employee_id) REFERENCES employees(id)
);

-- Create applications table
CREATE TABLE applications (
  -- Permit holder information
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  middle_name VARCHAR(255),
  last_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  receive_email_updates BOOLEAN NOT NULL DEFAULT false,
  address_line_1 VARCHAR(255) NOT NULL,
  address_line_2 VARCHAR(255),
  city VARCHAR(255) NOT NULL,
  province Province NOT NULL DEFAULT 'BC',
  country VARCHAR(255) NOT NULL DEFAULT 'Canada',
  postal_code VARCHAR(6) NOT NULL,

  -- Physician assessment
  permit_type PermitType NOT NULL DEFAULT 'PERMANENT',

  -- Payment information
  payment_method PaymentType NOT NULL,
  processing_fee MONEY NOT NULL,
  donation_amount MONEY NOT NULL DEFAULT 0.00,
  paid_through_shopify BOOLEAN NOT NULL DEFAULT false,
  shopify_payment_status ShopifyPaymentStatus DEFAULT 'PENDING',
  shopify_confirmation_number VARCHAR(255) UNIQUE,
  shopify_order_number VARCHAR(255) UNIQUE,

  -- Shipping information
  shipping_address_same_as_home_address BOOLEAN NOT NULL,
  shipping_full_name VARCHAR(255),
  shipping_address_line_1 VARCHAR(255),
  shipping_address_line_2 VARCHAR(255),
  shipping_city VARCHAR(255),
  shipping_province Province,
  shipping_country VARCHAR(255),
  shipping_postal_code VARCHAR(6),

  -- Billing information
  billing_address_same_as_home_address BOOLEAN NOT NULL,
  billing_full_name VARCHAR(255),
  billing_address_line_1 VARCHAR(255),
  billing_address_line_2 VARCHAR(255),
  billing_city VARCHAR(255),
  billing_province Province,
  billing_country VARCHAR(255),
  billing_postal_code VARCHAR(6),

  type ApplicationType NOT NULL,
  notes TEXT,
  applicant_id INTEGER,
  application_processing_id INTEGER UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY(applicant_id) REFERENCES applicants(id),
  FOREIGN KEY(application_processing_id) REFERENCES application_processing(id)
);

-- Create permits table
CREATE TABLE permits (
  rcd_permit_id INTEGER,
  type PermitType NOT NULL,
  expiry_date DATE NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  application_id INTEGER NOT NULL UNIQUE,
  applicant_id INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY(rcd_permit_id),
  FOREIGN KEY(application_id) REFERENCES applications(id),
  FOREIGN KEY(applicant_id) REFERENCES applicants(id)
);

-- Create replacements table (subset of applications)
CREATE TABLE replacement_applications (
  application_id INTEGER,

  -- Reason for replacement
  reason ReasonForReplacement NOT NULL,
  lost_timestamp TIMESTAMPTZ,
  lost_location VARCHAR(255),
  stolen_police_file_number INTEGER,
  stolen_jurisdiction VARCHAR(255),
  stolen_police_officer_name VARCHAR(255),
  event_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY(application_id),
  FOREIGN KEY(application_id) REFERENCES applications(id)
);

-- Create renewals table (subset of applications)
CREATE TABLE renewal_applications (
  application_id INTEGER,

  -- Physician information
  physician_first_name VARCHAR(255) NOT NULL,
  physician_last_name VARCHAR(255) NOT NULL,
  physician_msp_number VARCHAR(50) NOT NULL,
  physician_phone VARCHAR(50) NOT NULL,
  physician_address_line_1 VARCHAR(255) NOT NULL,
  physician_address_line_2 VARCHAR(255),
  physician_city VARCHAR(255) NOT NULL,
  physician_province Province NOT NULL DEFAULT 'BC',
  physician_country VARCHAR(255) NOT NULL DEFAULT 'Canada',
  physician_postal_code VARCHAR(6) NOT NULL,

  -- Additional Information
  uses_accessible_converted_van BOOLEAN NOT NULL,
  accessible_converted_van_loading_method AccessibleConvertedVanLoadingMethod,
  requires_wider_parking_space BOOLEAN NOT NULL,
  requires_wider_parking_space_reason RequiresWiderParkingSpaceReason,
  other_requires_wider_parking_space_reason VARCHAR(255),

  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY(application_id),
  FOREIGN KEY(application_id) REFERENCES applications(id)
);

-- Create new applications table (subset of applications)
CREATE TABLE new_applications (
  application_id INTEGER,
  date_of_birth DATE NOT NULL,
  gender Gender NOT NULL,
  other_gender VARCHAR(255),

  -- Physician assessment
  disability VARCHAR(255) NOT NULL,
  disability_certification_date DATE NOT NULL,
  patient_condition PatientCondition NOT NULL,
  mobility_aids MobilityAid ARRAY,
  other_mobility_aids VARCHAR(255),
  other_patient_condition VARCHAR(255),
  temporary_permit_expiry DATE,

  -- Physician information
  physician_first_name VARCHAR(255) NOT NULL,
  physician_last_name VARCHAR(255) NOT NULL,
  physician_msp_number VARCHAR(50) NOT NULL,
  physician_phone VARCHAR(50) NOT NULL,
  physician_address_line_1 VARCHAR(255) NOT NULL,
  physician_address_line_2 VARCHAR(255),
  physician_city VARCHAR(255) NOT NULL,
  physician_province Province NOT NULL DEFAULT 'BC',
  physician_country VARCHAR(255) NOT NULL DEFAULT 'Canada',
  physician_postal_code VARCHAR(6) NOT NULL,

  -- Guardian information
  guardian_first_name VARCHAR(255),
  guardian_middle_name VARCHAR(255),
  guardian_last_name VARCHAR(255),
  guardian_phone VARCHAR(50),
  guardian_relationship VARCHAR(50),
  guardian_address_line_1 VARCHAR(255),
  guardian_address_line_2 VARCHAR(255),
  guardian_city VARCHAR(255),
  guardian_province Province DEFAULT 'BC',
  guardian_country VARCHAR(255) DEFAULT 'Canada',
  guardian_postal_code VARCHAR(6),
  poa_form_s3_object_key VARCHAR(255),

  -- Additional Information
  uses_accessible_converted_van BOOLEAN NOT NULL,
  accessible_converted_van_loading_method AccessibleConvertedVanLoadingMethod,
  requires_wider_parking_space BOOLEAN NOT NULL,
  requires_wider_parking_space_reason RequiresWiderParkingSpaceReason,
  other_requires_wider_parking_space_reason VARCHAR(255),

  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY(application_id),
  FOREIGN KEY(application_id) REFERENCES applications(id)
);
