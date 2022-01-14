import { gql } from '@apollo/client'; // gql tag
import { ApplicantsFilter, Applicant, ApplicantStatus } from '@lib/graphql/types';

/** Row in permit holders table */
export type PermitHolderRow = {
  name: {
    firstName: string;
    middleName: string | null;
    lastName: string;
    rcdUserId: number | null;
  };
  dateOfBirth: Date;
  homeAddress: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    postalCode: string;
  };
  email: string;
  phone: string;
  mostRecentPermit: number;
  status: ApplicantStatus;
};

// TODO: Deprecate
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
