import { gql } from '@apollo/client'; // gql tag
import {
  ApplicantsFilter,
  Applicant,
  DeleteApplicantResult,
  Permit,
  PermitStatus,
  ApplicantStatus,
  MutationDeleteApplicantArgs,
  MutationSetApplicantAsInactiveArgs,
  SetApplicantAsInactiveResult,
  MutationSetApplicantAsActiveArgs,
  SetApplicantAsActiveResult,
} from '@lib/graphql/types';
import { CurrentApplication } from '@tools/admin/permit-holders/current-application';

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
export type PermitHolderRow = Pick<Applicant, 'id' | 'dateOfBirth' | 'phone' | 'status'> & {
  name: {
    id: number;
    firstName: string;
    middleName: string | null;
    lastName: string;
  };
  homeAddress: {
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    postalCode: string;
  };
  mostRecentPermit: Pick<Permit, 'expiryDate' | 'rcdPermitId'>;
  mostRecentApplication: CurrentApplication | null;
};

/**
 * Type for data required in Set Permit Holder Status modal
 */
export type PermitHolderToUpdateStatus = {
  readonly id: number;
  readonly status: ApplicantStatus;
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
        phone
        mostRecentPermit {
          expiryDate
          rcdPermitId
        }
        status
        mostRecentApplication {
          processing {
            status
          }
        }
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
  | 'phone'
  | 'status'
> & {
  mostRecentPermit: Pick<Permit, 'expiryDate' | 'rcdPermitId'>;
  mostRecentApplication: CurrentApplication | null;
};

export type GetPermitHoldersResponse = {
  applicants: {
    result: ReadonlyArray<PermitHolder>;
    totalCount: number;
  };
};

export const SET_APPLICANT_AS_INACTIVE = gql`
  mutation setApplicantAsInactive($input: SetApplicantAsInactiveInput!) {
    setApplicantAsInactive(input: $input) {
      ok
    }
  }
`;

export type SetApplicantAsInactiveRequest = MutationSetApplicantAsInactiveArgs;

export type SetApplicantAsInactiveResponse = {
  setApplicantAsInactive: SetApplicantAsInactiveResult;
};

export const SET_APPLICANT_AS_ACTIVE = gql`
  mutation setApplicantAsActive($input: SetApplicantAsActiveInput!) {
    setApplicantAsActive(input: $input) {
      ok
    }
  }
`;

export type SetApplicantAsActiveRequest = MutationSetApplicantAsActiveArgs;

export type SetApplicantAsActiveResponse = {
  setApplicantAsActive: SetApplicantAsActiveResult;
};

export const DELETE_APPLICANT = gql`
  mutation deleteApplicant($input: DeleteApplicantInput!) {
    deleteApplicant(input: $input) {
      ok
    }
  }
`;

export type DeleteApplicantRequest = MutationDeleteApplicantArgs;

export type DeleteApplicantResponse = {
  deleteApplicant: DeleteApplicantResult;
};
