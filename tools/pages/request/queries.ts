import { gql } from '@apollo/client'; // GraphQL queries

// Queries an Application by ID along with the associated permit, replacement, applicationProcessing, and applicant
export const GET_APPLICATION = gql`
  query GetApplication($id: ID!) {
    application(id: $id) {
      id
      rcdUserId
      firstName
      lastName
      gender
      customGender
      dateOfBirth
      email
      phone
      province
      city
      addressLine1
      addressLine2
      postalCode
      notes
      isRenewal

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

      billingAddressSameAsShippingAddress
      shippingFullName
      shippingAddressLine1
      shippingAddressLine2
      shippingCity
      shippingProvince
      shippingCountry
      shippingPostalCode
      billingFullName
      billingAddressLine1
      billingAddressLine2
      billingCity
      billingProvince
      billingCountry
      billingPostalCode

      processingFee
      donationAmount
      paymentMethod
      shopifyConfirmationNumber
      createdAt

      permit {
        id
        rcdPermitId
        expiryDate
        receiptId
        active
      }

      replacement {
        id
        reason
        lostTimestamp
        lostLocation
        stolenPoliceFileNumber
        stolenJurisdiction
        stolenPoliceOfficerName
        description
      }

      applicationProcessing {
        id
        status
        appNumber
        appHolepunched
        walletCardCreated
        invoiceNumber
        documentUrls
        appMailed
        updatedAt
      }

      applicant {
        id
        status
      }
    }
  }
`;