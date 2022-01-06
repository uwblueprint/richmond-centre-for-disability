import { Application, Physician, Renewal, Replacement } from '@lib/graphql/types'; // GraphQL Types

// Permit Holder Information Object for Replacements
export type PermitHolderInformation = Pick<
  Application,
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'phone'
  | 'addressLine1'
  | 'addressLine2'
  | 'city'
  | 'postalCode'
>;

// Permit Holder Information Object for new and renewal permits
export type NewAndRenewalPermitHolderInformation = PermitHolderInformation &
  Pick<Application, 'receiveEmailUpdates'>;

// Additional Questions Object
export type AdditionalQuestions = Pick<
  Renewal,
  'usesAccessibleConvertedVan' | 'requiresWiderParkingSpace'
>;

// Payment Details Object
export type PaymentDetails = Pick<
  Application,
  | 'paymentMethod'
  | 'donationAmount'
  | 'shippingAddressSameAsHomeAddress'
  | 'shippingFullName'
  | 'shippingAddressLine1'
  | 'shippingAddressLine2'
  | 'shippingCity'
  | 'shippingProvince'
  | 'shippingPostalCode'
  | 'billingAddressSameAsHomeAddress'
  | 'billingFullName'
  | 'billingAddressLine1'
  | 'billingAddressLine2'
  | 'billingCity'
  | 'billingProvince'
  | 'billingPostalCode'
>;

// Reason For Replacement Object
export type ReasonForReplacement = Pick<
  Replacement,
  | 'reason'
  | 'lostTimestamp'
  | 'lostLocation'
  | 'description'
  | 'stolenPoliceFileNumber'
  | 'stolenJurisdiction'
  | 'stolenPoliceOfficerName'
>;

// Doctor Information Object
export type DoctorInformation = Pick<
  Physician,
  'mspNumber' | 'name' | 'phone' | 'addressLine1' | 'addressLine2' | 'city' | 'postalCode'
>;

// Physician Assessment Information Object
export type PhysicianAssessmentInformation = Pick<
  Application,
  'disability' | 'patientEligibility' | 'permitType'
> & {
  //TODO: Update DB to account for these columns
  physicianCertificationDate: string;
  patientEligibilityDescription?: string;
  temporaryPermitExpiryDate?: string;
};

// Guardian Information Object
export type GuardianInformation = Pick<
  Application,
  | 'firstName'
  | 'middleName'
  | 'lastName'
  | 'guardianRelationship'
  | 'phone'
  | 'addressLine1'
  | 'addressLine2'
  | 'city'
  | 'postalCode'
  | 'poaFormUrl'
>;
