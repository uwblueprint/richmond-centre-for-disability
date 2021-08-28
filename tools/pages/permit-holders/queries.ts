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
      status

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
        id
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

      fileHistory {
        documentUrls
        appNumber
        createdAt
      }

      applications {
        id
        disability
        affectsMobility
        mobilityAidRequired
        cannotWalk100m
        aid
        createdAt
        notes
      }
    }
  }
`;
