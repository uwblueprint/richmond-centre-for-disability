// doctorsTypeahead.ts
import { gql } from '@apollo/client';
import { Physician } from '@lib/graphql/types';

/** A simplified Physician type used for the typeahead result */
export type DoctorResult = Pick<Physician, 'mspNumber' | 'firstName' | 'lastName' | 'phone'>;

/** GraphQL query to search for physicians */
export const SEARCH_DOCTORS = gql`
  query SearchPhysicians($filter: PhysiciansFilter!) {
    physicians(filter: $filter) {
      result {
        mspNumber
        firstName
        lastName
        phone
      }
    }
  }
`;

/** Query request variables */
export type SearchDoctorsRequest = {
  filter: {
    firstName?: string;
    lastName?: string;
    mspNumber?: string;
    limit?: number;
    offset?: number;
  };
};

/** Query response type */
export type SearchDoctorsResponse = {
  physicians: {
    result: Array<DoctorResult>;
  };
};
