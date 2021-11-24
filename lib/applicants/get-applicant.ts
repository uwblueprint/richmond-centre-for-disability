import { gql } from '@apollo/client'; // gql tag
import { Applicant } from '@lib/graphql/types'; // GraphQL types

/**
 * GQL query to fetch employees based on filter
 */
export const GET_APPLICANT_QUERY = gql`
  query getApplicant($id: ID!) {
    applicant(id: $id) {
      firstName
      lastName
      email
      phone
      addressLine1
      addressLine2
      city
      postalCode
      id
      rcdUserId
    }
  }
`;

/**
 * Input parameters for fetch all employees
 */
export type GetApplicantRequest = Pick<Applicant, 'id'>;

/**
 * Response type of getting employees
 */
export type GetApplicantResponse = {
  applicant: Pick<
    Applicant,
    | 'firstName'
    | 'lastName'
    | 'email'
    | 'phone'
    | 'addressLine1'
    | 'addressLine2'
    | 'city'
    | 'postalCode'
    | 'rcdUserId'
    | 'id'
  >;
};
