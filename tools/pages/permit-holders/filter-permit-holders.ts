import { gql } from '@apollo/client'; // gql tag

export const FILTER_PERMIT_HOLDERS_QUERY = gql`
  query FilterPermitHoldersQuery($filter: ApplicantsFilter) {
    applicants(filter: $filter) {
      firstName
      middleName
      lastName
      dateOfBirth
      addressLine1
      city
      postalCode
      email
      phone
      recentPermit {
        expiryDate
        rcdPermitId
      }
      status
      id
    }
  }
`;
