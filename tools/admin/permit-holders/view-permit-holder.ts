import { gql } from '@apollo/client';
import { Applicant, QueryApplicantArgs } from '@lib/graphql/types';

/** Get basic applicant information */
export const GET_APPLICANT_QUERY = gql`
  query GetApplicant($id: Int!) {
    applicant(id: $id) {
      id
      firstName
      middleName
      lastName
      rcdUserId
      status
    }
  }
`;

export type GetApplicantRequest = QueryApplicantArgs;

export type GetApplicantResponse = {
  applicant: Pick<Applicant, 'firstName' | 'middleName' | 'lastName' | 'rcdUserId' | 'status'>;
};
