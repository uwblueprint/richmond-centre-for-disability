import {
  Application,
  UpdateApplicationProcessingResult,
  UpdateApplicationResult,
  Scalars,
  CompleteApplicationResult,
  QueryApplicationArgs,
  MutationUpdateApplicationArgs,
  MutationUpdateApplicationProcessingArgs,
  ApplicationProcessing,
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
    | 'dateOfBirth'
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
