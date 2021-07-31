import { gql } from '@apollo/client'; // GraphQL queries

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
