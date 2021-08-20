import { gql } from '@apollo/client'; // gql tag
import { ApplicantsFilter, Applicant } from '@lib/graphql/types';

export const FILTER_PERMIT_HOLDERS_QUERY = gql`
  query FilterPermitHoldersQuery($filter: ApplicantsFilter) {
    applicants(filter: $filter) {
      result {
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
      totalCount
    }
  }
`;

export type FilterPermitHoldersRequest = {
  filter: ApplicantsFilter;
};

export type FilterPermitHoldersResponse = {
  applicants: {
    result: [Applicant];
    totalCount: number;
  };
};
