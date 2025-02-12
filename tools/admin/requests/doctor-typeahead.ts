// doctorsTypeahead.ts
import { gql } from '@apollo/client';
import { Physician } from '@lib/graphql/types'; // assumes a generated Physician type

/** A simplified Physician type used for the typeahead result */
export type DoctorResult = Pick<Physician, 'mspNumber' | 'firstName' | 'lastName' | 'phone'>;

/** GraphQL query to search for physicians by a filter (e.g. MSP or name) */
export const SEARCH_DOCTORS = gql`
  query SearchDoctors($filter: PhysiciansFilter!) {
    physicians(filter: $filter) {
      result {
        mspNumber
        firstName
        lastName
      }
    }
  }
`;

/** Query request variables */
export type SearchDoctorsRequest = { filter: { search: string } };

/** Query response type */
export type SearchDoctorsResponse = {
  physicians: {
    result: DoctorResult[];
  };
};
