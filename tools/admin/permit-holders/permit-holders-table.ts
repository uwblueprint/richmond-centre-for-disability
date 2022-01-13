import { gql } from '@apollo/client'; // gql tag
import {
  ApplicantsFilter,
  Applicant,
  Permit,
  PermitStatus,
  ApplicantStatus,
} from '@lib/graphql/types';

/** Array of permit statuses */
export const PERMIT_STATUSES: Array<{ name: string; value: PermitStatus }> = [
  { name: 'Active', value: 'ACTIVE' },
  { name: 'Expiring soon', value: 'EXPIRING' },
  { name: 'Expired', value: 'EXPIRED' },
];

/** Array of user (applicant) statuses */
export const USER_STATUSES: Array<{ name: string; value: ApplicantStatus }> = [
  { name: 'Active', value: 'ACTIVE' },
  { name: 'Inactive', value: 'INACTIVE' },
];

/** Row in permit holders table */
export type PermitHolderRow = Pick<
  Applicant,
  'id' | 'dateOfBirth' | 'email' | 'phone' | 'status'
> & {
  name: {
    firstName: string;
    middleName: string | null;
    lastName: string;
    rcdUserId: number | null;
  };
  homeAddress: {
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    postalCode: string;
  };
  mostRecentPermit: Pick<Permit, 'expiryDate' | 'rcdPermitId'>;
};

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
        addressLine2
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
  | 'addressLine2'
  | 'city'
  | 'postalCode'
  | 'email'
  | 'phone'
  | 'status'
  | 'rcdUserId'
> & {
  mostRecentPermit: Pick<Permit, 'expiryDate' | 'rcdPermitId'>;
};

export type GetPermitHoldersResponse = {
  applicants: {
    result: ReadonlyArray<PermitHolder>;
    totalCount: number;
  };
};
