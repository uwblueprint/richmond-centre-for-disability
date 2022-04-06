import {
  Applicant,
  Application,
  Guardian,
  MedicalInformation,
  NewApplication,
  Permit,
  Physician,
  RenewalApplication,
  ReplacementApplication,
} from '@prisma/client'; // GraphQL types

// Type of Applicant to upsert in DB
export type UpsertApplicant = Pick<
  Applicant,
  | 'id'
  | 'firstName'
  | 'middleName'
  | 'lastName'
  | 'dateOfBirth'
  | 'gender'
  | 'phone'
  | 'email'
  | 'receiveEmailUpdates'
  | 'province'
  | 'city'
  | 'addressLine1'
  | 'postalCode'
  | 'status'
> & {
  readonly medicalInformation: Pick<
    MedicalInformation,
    | 'disability'
    | 'disabilityCertificationDate'
    | 'patientCondition'
    | 'mobilityAids'
    | 'otherPatientCondition'
  > & {
    readonly physician: Pick<
      Physician,
      | 'mspNumber'
      | 'firstName'
      | 'lastName'
      | 'phone'
      | 'addressLine1'
      | 'addressLine2'
      | 'city'
      | 'postalCode'
    >;
  };
  readonly guardian?: Pick<
    Guardian,
    | 'firstName'
    | 'middleName'
    | 'lastName'
    | 'phone'
    | 'addressLine1'
    | 'addressLine2'
    | 'city'
    | 'postalCode'
    | 'relationship'
  >;
};

// Type of Application to upsert in DB
export type UpsertApplication = Pick<
  Application,
  | 'id'
  | 'firstName'
  | 'middleName'
  | 'lastName'
  | 'phone'
  | 'email'
  | 'receiveEmailUpdates'
  | 'addressLine1'
  | 'addressLine2'
  | 'city'
  | 'postalCode'
  | 'permitType'
  | 'paymentMethod'
  | 'processingFee'
  | 'donationAmount'
  | 'shippingAddressSameAsHomeAddress'
  | 'shippingFullName'
  | 'shippingAddressLine1'
  | 'shippingAddressLine2'
  | 'shippingCity'
  | 'shippingProvince'
  | 'shippingCountry'
  | 'shippingPostalCode'
  | 'billingAddressSameAsHomeAddress'
  | 'billingFullName'
  | 'billingAddressLine1'
  | 'billingAddressLine2'
  | 'billingCity'
  | 'billingProvince'
  | 'billingCountry'
  | 'billingPostalCode'
  | 'billingFullName'
  | 'applicantId'
  | 'paidThroughShopify'
  | 'shopifyPaymentStatus'
  | 'shopifyConfirmationNumber'
> &
  (
    | {
        type: 'NEW';
        newApplication: Pick<
          NewApplication,
          | 'dateOfBirth'
          | 'gender'
          | 'disability'
          | 'disabilityCertificationDate'
          | 'patientCondition'
          | 'mobilityAids'
          | 'otherPatientCondition'
          | 'temporaryPermitExpiry'
          | 'physicianFirstName'
          | 'physicianLastName'
          | 'physicianMspNumber'
          | 'physicianPhone'
          | 'physicianAddressLine1'
          | 'physicianAddressLine2'
          | 'physicianCity'
          | 'physicianPostalCode'
          | 'guardianFirstName'
          | 'guardianMiddleName'
          | 'guardianLastName'
          | 'guardianPhone'
          | 'guardianRelationship'
          | 'guardianAddressLine1'
          | 'guardianAddressLine2'
          | 'guardianCity'
          | 'guardianPostalCode'
          | 'usesAccessibleConvertedVan'
          | 'accessibleConvertedVanLoadingMethod'
          | 'requiresWiderParkingSpace'
          | 'requiresWiderParkingSpaceReason'
          | 'otherRequiresWiderParkingSpaceReason'
        >;
        renewalApplication: undefined;
        replacementApplication: undefined;
      }
    | {
        type: 'RENEWAL';
        newApplication: undefined;
        renewalApplication: Pick<
          RenewalApplication,
          | 'physicianFirstName'
          | 'physicianLastName'
          | 'physicianMspNumber'
          | 'physicianPhone'
          | 'physicianAddressLine1'
          | 'physicianAddressLine2'
          | 'physicianCity'
          | 'physicianPostalCode'
          | 'usesAccessibleConvertedVan'
          | 'accessibleConvertedVanLoadingMethod'
          | 'requiresWiderParkingSpace'
          | 'requiresWiderParkingSpaceReason'
          | 'otherRequiresWiderParkingSpaceReason'
        >;
        replacementApplication: undefined;
      }
    | {
        type: 'REPLACEMENT';
        newApplication: undefined;
        renewalApplication: undefined;
        replacementApplication: Pick<
          ReplacementApplication,
          | 'reason'
          | 'lostTimestamp'
          | 'lostLocation'
          | 'stolenPoliceFileNumber'
          | 'stolenJurisdiction'
          | 'stolenPoliceOfficerName'
          | 'eventDescription'
        >;
      }
  );

// Type of Permit to upsert in DB
export type UpsertPermit = Pick<
  Permit,
  'rcdPermitId' | 'applicantId' | 'applicationId' | 'type' | 'expiryDate' | 'active'
>;
