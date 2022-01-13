import { gql } from '@apollo/client'; // GraphQL queries
import {
  Application,
  ApplicationProcessing,
  Permit,
  QueryApplicationArgs,
} from '@lib/graphql/types';

// Queries an Application by ID along with the associated permit, replacement, applicationProcessing, and applicant
export const GET_APPLICATION_QUERY = gql`
  query GetApplication($id: Int!) {
    application(id: $id) {
      __typename

      id

      firstName
      middleName
      lastName
      phone
      email
      receiveEmailUpdates
      addressLine1
      addressLine2
      city
      province
      country
      postalCode

      permitType

      paymentMethod
      processingFee
      donationAmount
      paidThroughShopify
      shopifyPaymentStatus
      shopifyConfirmationNumber

      shippingAddressSameAsHomeAddress
      shippingFullName
      shippingAddressLine1
      shippingAddressLine2
      shippingCity
      shippingProvince
      shippingCountry
      shippingPostalCode

      billingAddressSameAsHomeAddress
      billingFullName
      billingAddressLine1
      billingAddressLine2
      billingCity
      billingProvince
      billingCountry
      billingPostalCode

      type
      createdAt

      processing {
        status
      }

      ... on RenewalApplication {
        physicianFirstName
        physicianLastName
        physicianMspNumber
        physicianPhone
        physicianAddressLine1
        physicianAddressLine2
        physicianCity
        physicianProvince
        physicianCountry
        physicianPostalCode
        usesAccessibleConvertedVan
        accessibleConvertedVanLoadingMethod
        requiresWiderParkingSpace
        requiresWiderParkingSpaceReason
        otherRequiresWiderParkingSpaceReason
        applicant {
          dateOfBirth
          gender
        }
      }

      ... on ReplacementApplication {
        reason
        lostTimestamp
        lostLocation
        stolenPoliceFileNumber
        stolenJurisdiction
        stolenPoliceOfficerName
        eventDescription
        applicant {
          dateOfBirth
          gender
        }
      }
    }
  }
`;

// Get application request type
export type GetApplicationRequest = QueryApplicationArgs;

// Get application response type
// TODO: Account for application types
export type GetApplicationResponse = {
  application: Pick<
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
    | 'province'
    | 'country'
    | 'postalCode'
    | 'permitType'
    | 'paymentMethod'
    | 'processingFee'
    | 'donationAmount'
    | 'paidThroughShopify'
    | 'shopifyPaymentStatus'
    | 'shopifyConfirmationNumber'
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
    | 'type'
    | 'createdAt'
  > & {
    processing: Pick<ApplicationProcessing, 'status'>;
  };
};
