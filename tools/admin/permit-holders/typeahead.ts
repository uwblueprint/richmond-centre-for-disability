import { gql } from '@apollo/client';
import { Applicant } from '@lib/graphql/types';

/** Permit holder result in typeahead dropdown */
export type PermitHolderResult = Pick<
  Applicant,
  'id' | 'firstName' | 'middleName' | 'lastName' | 'dateOfBirth'
>;

/** Search for permit holders */
export const SEARCH_PERMIT_HOLDERS = gql`
  query SearchPermitHolders($filter: ApplicantsFilter!) {
    applicants(filter: $filter) {
      result {
        id
        firstName
        middleName
        lastName
        dateOfBirth
      }
    }
  }
`;

export type SearchPermitHoldersRequest = { filter: { search: string } };

export type SearchPermitHoldersResponse = {
  applicants: {
    result: Array<PermitHolderResult>;
  };
};
