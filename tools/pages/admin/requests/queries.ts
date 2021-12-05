import { gql } from '@apollo/client'; // GraphQL queries
import {
  GenerateApplicantsReportResult,
  QueryGenerateApplicantsReportArgs,
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
      phone
      province
      city
      addressLine1
      addressLine2
      postalCode
      notes

      disability
      affectsMobility
      mobilityAidRequired
      cannotWalk100m

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

export const GET_APPLICANT_RENEWAL_QUERY = gql`
  query getApplicantRenewal($id: ID!) {
    applicant(id: $id) {
      firstName
      lastName
      email
      phone
      addressLine1
      addressLine2
      city
      postalCode
      id
      rcdUserId
      dateOfBirth
      status
      gender
      province
      medicalInformation {
        physician {
          name
          mspNumber
          addressLine1
          addressLine2
          city
          postalCode
          phone
        }
      }
      mostRecentRenewal {
        id
        shippingFullName
        shippingAddressLine1
        shippingAddressLine2
        shippingCity
        shippingProvince
        shippingPostalCode
        shippingAddressSameAsHomeAddress
        renewal {
          usesAccessibleConvertedVan
          requiresWiderParkingSpace
        }
      }
    }
  }
`;

export const GET_APPLICANT_REPLACEMENT_QUERY = gql`
  query getApplicant($id: ID!) {
    applicant(id: $id) {
      firstName
      lastName
      email
      phone
      addressLine1
      addressLine2
      city
      postalCode
      id
      rcdUserId
      dateOfBirth
      status
      gender
      province
      mostRecentApplication {
        shippingAddressSameAsHomeAddress
        shippingFullName
        shippingAddressLine1
        shippingAddressLine2
        shippingCity
        shippingProvince
        shippingPostalCode
      }
    }
  }
`;

export const GENERATE_APPLICANTS_REPORT_QUERY = gql`
  query GenerateApplicantsReportQuery($input: GenerateApplicantsReportInput!) {
    generateApplicantsReport(input: $input) {
      ok
    }
  }
`;

// Generate applicants report query arguments
export type GenerateApplicantsReportRequest = QueryGenerateApplicantsReportArgs;

// Generate applicants report query result
export type GenerateApplicantsReportResponse = {
  generateApplicantsReport: GenerateApplicantsReportResult;
};
