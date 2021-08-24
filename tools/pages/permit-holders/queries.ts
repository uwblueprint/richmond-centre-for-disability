import { gql } from '@apollo/client'; // GraphQL queries

export const GET_PERMIT_HOLDER = gql`
  query GetPermitHolder($id: ID!) {
    applicant(id: $id) {
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

      permits {
        id
        rcdPermitId
        expiryDate
        receiptId
        active
      }

      medicalHistory {
        applicationId
        physician
      }

      medicalInformation {
        id
        disability
        affectsMobility
        mobilityAidRequired
        cannotWalk100m
        notes
        certificationDate
        aid
        physicianId
        createdAt
        updatedAt
      }
    }
  }
`;
