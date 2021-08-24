import { gql } from '@apollo/client'; // gql tag
import { ApplicantsFilter, Applicant } from '@lib/graphql/types';

export const GET_PERMIT_HOLDERS_QUERY = gql`
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
        mostRecentPermit {
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

export type GetPermitHoldersRequest = {
  filter: ApplicantsFilter;
};

export type PermitHolder = Pick<
  Applicant,
  | 'firstName'
  | 'middleName'
  | 'lastName'
  | 'dateOfBirth'
  | 'addressLine1'
  | 'city'
  | 'postalCode'
  | 'email'
  | 'phone'
  | 'mostRecentPermit'
  | 'status'
  | 'id'
>;

export type GetPermitHoldersResponse = {
  applicants: {
    result: ReadonlyArray<PermitHolder>;
    totalCount: number;
  };
};
