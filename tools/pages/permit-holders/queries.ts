import { gql } from '@apollo/client'; // GraphQL queries

export const GET_PERMIT_HOLDER = gql`
  query GetPermitHolder($id: ID!) {
    applicant(id: $id) {
      id
      rcdUserId
      firstName
      middleName
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

      activePermit {
        expiryDate
        application {
          isRenewal
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

          guardianFirstName
          guardianMiddleName
          guardianLastName
          guardianPhone
          guardianProvince
          guardianCity
          guardianAddressLine1
          guardianAddressLine2
          guardianPostalCode
          guardianRelationship
          guardianNotes

          createdAt

          applicationProcessing {
            status
          }
        }
      }

      permits {
        id
        rcdPermitId
        expiryDate
        receiptId
        active
        applicationId
        application {
          isRenewal
          applicationProcessing {
            status
          }
        }
      }

      medicalHistory {
        applicationId
        physician {
          name
          mspNumber
          phone
        }
      }

      medicalInformation {
        physician {
          name
          mspNumber
          addressLine1
          addressLine2
          city
          province
          postalCode
          phone
          status
          notes
        }
      }

      guardian {
        firstName
        middleName
        lastName
        addressLine1
        addressLine2
        city
        province
        postalCode
        phone
        relationship
        notes
      }
    }
  }
`;
