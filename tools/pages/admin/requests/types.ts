import {
  Applicant,
  Application,
  UpdateApplicationProcessingResult,
  UpdateApplicationResult,
  Scalars,
  CompleteApplicationResult,
  QueryApplicationArgs,
  MutationUpdateApplicationArgs,
  MutationUpdateApplicationProcessingArgs,
  ApplicationProcessing,
  Permit,
  Physician,
  Renewal,
} from '@lib/graphql/types'; // GraphQL types

// Get application request type
export type GetApplicationRequest = QueryApplicationArgs;

// Get application response type
export type GetApplicationResponse = {
  application: Pick<
    Application,
    | 'id'
    | 'applicantId'
    | 'rcdUserId'
    | 'firstName'
    | 'middleName'
    | 'lastName'
    | 'gender'
    | 'customGender'
    | 'email'
    | 'phone'
    | 'province'
    | 'city'
    | 'addressLine1'
    | 'addressLine2'
    | 'postalCode'
    | 'notes'
    | 'disability'
    | 'affectsMobility'
    | 'mobilityAidRequired'
    | 'cannotWalk100m'
    | 'physicianName'
    | 'physicianMspNumber'
    | 'physicianAddressLine1'
    | 'physicianAddressLine2'
    | 'physicianCity'
    | 'physicianProvince'
    | 'physicianPostalCode'
    | 'physicianPhone'
    | 'physicianNotes'
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
    | 'processingFee'
    | 'donationAmount'
    | 'paymentMethod'
    | 'shopifyConfirmationNumber'
    | 'createdAt'
    | 'isRenewal'
  > & {
    readonly applicationProcessing: Pick<
      ApplicationProcessing,
      | 'status'
      | 'appNumber'
      | 'appHolepunched'
      | 'walletCardCreated'
      | 'invoiceNumber'
      | 'documentUrls'
      | 'appMailed'
    > | null;
    readonly applicant: {
      readonly mostRecentPermit: Pick<Permit, 'rcdPermitId' | 'expiryDate'>;
    };
  };
};

// Update application request type
export type UpdateApplicationRequest = MutationUpdateApplicationArgs;

// Update application response type
export type UpdateApplicationResponse = {
  updateApplication: UpdateApplicationResult;
};

// Update application processing request type
export type UpdateApplicationProcessingRequest = MutationUpdateApplicationProcessingArgs;

// Update application processing response type
export type UpdateApplicationProcessingResponse = {
  updateApplicationProcessing: UpdateApplicationProcessingResult;
};

// Approve application request type
export type ApproveApplicationRequest = {
  applicationId: Scalars['ID'];
};

// Approve application response type
export type ApproveApplicationResponse = UpdateApplicationProcessingResponse;

// Reject application request type
export type RejectApplicationRequest = {
  applicationId: Scalars['ID'];
};

// Reject application response type
export type RejectApplicationResponse = UpdateApplicationProcessingResponse;

// Complete application request type
export type CompleteApplicationRequest = {
  applicationId: Scalars['ID'];
};

// Complete application response type
export type CompleteApplicationResponse = {
  completeApplication: CompleteApplicationResult;
};

// Get Applicant Renewal Application Request
export type GetApplicantRenewalRequest = Pick<Applicant, 'id'>;

// Get Applicant Renewal Application Response
export type GetApplicantRenewalResponse = {
  applicant: Pick<
    Applicant,
    | 'id'
    | 'firstName'
    | 'lastName'
    | 'email'
    | 'phone'
    | 'addressLine1'
    | 'addressLine2'
    | 'city'
    | 'postalCode'
    | 'rcdUserId'
  > & {
    medicalInformation: {
      physician: Pick<
        Physician,
        'name' | 'mspNumber' | 'addressLine1' | 'addressLine2' | 'city' | 'postalCode' | 'phone'
      >;
    };
  } & {
    mostRecentRenewal: Pick<
      Application,
      | 'id'
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
      | 'shippingAddressSameAsHomeAddress'
      | 'billingAddressSameAsHomeAddress'
      | 'paymentMethod'
    > & {
      renewal: Pick<Renewal, 'usesAccessibleConvertedVan' | 'requiresWiderParkingSpace'>;
    };
  };
};
