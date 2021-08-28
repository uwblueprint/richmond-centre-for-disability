import {
  Applicant,
  Permit,
  Application,
  ApplicationProcessing,
  Physician,
  Guardian,
} from '@lib/graphql/types';

export type GetPermitHolderRequest = {
  id: number;
};

export type GetPermitHolderResponse = {
  readonly applicant: Pick<
    Applicant,
    | 'id'
    | 'rcdUserId'
    | 'firstName'
    | 'middleName'
    | 'lastName'
    | 'gender'
    | 'customGender'
    | 'dateOfBirth'
    | 'email'
    | 'phone'
    | 'province'
    | 'city'
    | 'addressLine1'
    | 'addressLine2'
    | 'postalCode'
    | 'status'
  > & {
    readonly activePermit: Pick<Permit, 'expiryDate'> & {
      readonly application: Pick<
        Application,
        | 'isRenewal'
        | 'physicianName'
        | 'physicianMspNumber'
        | 'physicianAddressLine1'
        | 'physicianAddressLine2'
        | 'physicianCity'
        | 'physicianProvince'
        | 'physicianPostalCode'
        | 'physicianPhone'
        | 'physicianNotes'
        | 'processingFee'
        | 'donationAmount'
        | 'paymentMethod'
        | 'shopifyConfirmationNumber'
        | 'shippingAddressSameAsHomeAddress'
        | 'billingAddressSameAsHomeAddress'
        | 'shippingFullName'
        | 'shippingAddressLine1'
        | 'shippingAddressLine2'
        | 'shippingCity'
        | 'shippingProvince'
        | 'shippingPostalCode'
        | 'billingFullName'
        | 'billingAddressLine1'
        | 'billingAddressLine2'
        | 'billingCity'
        | 'billingProvince'
        | 'billingPostalCode'
        | 'guardianFirstName'
        | 'guardianMiddleName'
        | 'guardianLastName'
        | 'guardianPhone'
        | 'guardianProvince'
        | 'guardianCity'
        | 'guardianAddressLine1'
        | 'guardianAddressLine2'
        | 'guardianPostalCode'
        | 'guardianRelationship'
        | 'guardianNotes'
        | 'createdAt'
      > & {
        readonly applicationProcessing: Pick<ApplicationProcessing, 'status'>;
      };
    };
  } & {
    permits: ReadonlyArray<
      Pick<Permit, 'rcdPermitId' | 'expiryDate' | 'applicationId'> & {
        application: Pick<Application, 'isRenewal'> & {
          applicationProcessing: Pick<ApplicationProcessing, 'status'>;
        };
      }
    >;
  } & {
    readonly physician: Pick<
      Physician,
      | 'name'
      | 'mspNumber'
      | 'addressLine1'
      | 'addressLine2'
      | 'city'
      | 'province'
      | 'postalCode'
      | 'phone'
      | 'status'
      | 'notes'
    >;
  } & {
    readonly medicalInformation: {
      readonly physician: Pick<
        Physician,
        | 'name'
        | 'mspNumber'
        | 'addressLine1'
        | 'addressLine2'
        | 'city'
        | 'province'
        | 'postalCode'
        | 'phone'
        | 'status'
        | 'notes'
      >;
    };
  } & {
    readonly guardian: Pick<
      Guardian,
      | 'id'
      | 'firstName'
      | 'middleName'
      | 'lastName'
      | 'addressLine1'
      | 'addressLine2'
      | 'city'
      | 'province'
      | 'postalCode'
      | 'phone'
      | 'relationship'
      | 'notes'
    >;
  };
};
