import {
  Applicant,
  Application,
  ApplicationProcessing,
  Guardian,
  MedicalInformation,
  Permit,
  Physician,
} from '@prisma/client'; // GraphQL types

// Type of Applicant to upsert in DB
export type UpsertApplicant = Pick<
  Applicant,
  | 'id'
  | 'rcdUserId'
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'gender'
  | 'phone'
  | 'province'
  | 'city'
  | 'addressLine1'
  | 'postalCode'
  | 'guardianId'
  | 'medicalInformationId'
  | 'status'
>;

// Type of Permit to upsert in DB
export type UpsertPermit = Pick<
  Permit,
  'rcdPermitId' | 'applicantId' | 'applicationId' | 'expiryDate' | 'active'
>;

// Type of Guardian to upsert in DB
export type UpsertGuardian = Pick<
  Guardian,
  | 'id'
  | 'firstName'
  | 'lastName'
  | 'phone'
  | 'province'
  | 'city'
  | 'addressLine1'
  | 'postalCode'
  | 'relationship'
>;

// Type of Application to upsert in DB
export type UpsertApplication = Pick<
  Application,
  | 'id'
  | 'firstName'
  | 'middleName'
  | 'lastName'
  | 'phone'
  | 'province'
  | 'city'
  | 'addressLine1'
  | 'postalCode'
  | 'disability'
  | 'physicianName'
  | 'certificationDate'
  | 'patientEligibility'
  | 'aid'
  | 'expiryDate'
  | 'physicianMspNumber'
  | 'physicianAddressLine1'
  | 'physicianCity'
  | 'physicianPostalCode'
  | 'physicianProvince'
  | 'physicianPhone'
  | 'processingFee'
  | 'paymentMethod'
  | 'shopifyConfirmationNumber'
  | 'applicantId'
  | 'email'
  | 'shippingFullName'
  | 'shippingAddressLine1'
  | 'shippingCity'
  | 'shippingProvince'
  | 'shippingPostalCode'
  | 'billingFullName'
> & {
  applicationProcessingId: number;
};

// Type of Physician to upsert in DB
export type UpsertPhysician = Pick<
  Physician,
  'name' | 'mspNumber' | 'addressLine1' | 'city' | 'province' | 'postalCode' | 'phone' | 'status'
> & {
  id: number;
};

// Type of Medical Information to upsert in DB
export type UpsertMedicalInformation = Pick<
  MedicalInformation,
  'id' | 'disability' | 'patientEligibility' | 'physicianId'
>;

// Type of Application Processing to upsert in DB
export type UpsertApplicationProcessing = Pick<
  ApplicationProcessing,
  | 'status'
  | 'appNumber'
  | 'appHolepunched'
  | 'walletCardCreated'
  | 'invoiceNumber'
  | 'documentsUrl'
  | 'appMailed'
> & {
  id: number;
};
