import { gql } from '@apollo/client'; // gql tag
import { ApplicantsFilter, Applicant } from '@lib/graphql/types';

export const GET_PERMIT_HOLDERS_QUERY = gql`
  query FilterPermitHoldersQuery($filter: ApplicantsFilter) {
    applicants(filter: $filter) {
      result {
        id
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
        rcdUserId
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
  | 'id'
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
  | 'rcdUserId'
>;

export type GetPermitHoldersResponse = {
  applicants: {
    result: ReadonlyArray<PermitHolder>;
    totalCount: number;
  };
};
