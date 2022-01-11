import { gql } from '@apollo/client'; // GraphQL queries
import {
  Application,
  ApplicationProcessing,
  Permit,
  QueryApplicationArgs,
} from '@lib/graphql/types';

// Queries an Application by ID along with the associated permit, replacement, applicationProcessing, and applicant
export const GET_APPLICATION_QUERY = gql`
  query GetApplication($id: ID!) {
    application(id: $id) {
      id
      applicantId
      rcdUserId
      firstName
      lastName
      gender
      customGender
      email
      receiveEmailUpdates
      phone
      province
      city
      addressLine1
      addressLine2
      postalCode
      notes

      disability
      patientEligibility

      physicianName
      physicianMspNumber
      physicianAddressLine1
      physicianAddressLine2
      physicianCity
      physicianProvince
      physicianPostalCode
      physicianPhone
      physicianNotes

      shippingAddressSameAsHomeAddress
      billingAddressSameAsHomeAddress
      shippingFullName
      shippingAddressLine1
      shippingAddressLine2
      shippingCity
      shippingProvince
      shippingPostalCode
      billingFullName
      billingAddressLine1
      billingAddressLine2
      billingCity
      billingProvince
      billingPostalCode

      processingFee
      donationAmount
      paymentMethod
      shopifyConfirmationNumber
      createdAt
      isRenewal

      applicationProcessing {
        status
        appNumber
        appHolepunched
        walletCardCreated
        invoiceNumber
        documentUrls
        appMailed
      }

      applicant {
        mostRecentPermit {
          rcdPermitId
          expiryDate
        }
      }
    }
  }
`;

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
    | 'receiveEmailUpdates'
    | 'phone'
    | 'province'
    | 'city'
    | 'addressLine1'
    | 'addressLine2'
    | 'postalCode'
    | 'notes'
    | 'disability'
    | 'patientEligibility'
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
