import { gql } from '@apollo/client'; // GraphQL queries

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
