import { gql } from '@apollo/client'; // GraphQL queries
import { Application, Applicant, QueryApplicationArgs } from '@lib/graphql/types';

// Queries an Application by ID along with the associated permit, replacement, applicationProcessing, and applicant
export const GET_REVIEW_INFORMATION_QUERY = gql`
  query GetApplication($id: Int!) {
    application(id: $id) {
      id
      type
      applicant {
        guardian
      }
    }
  }
`;

// Get application request type
export type GetReviewInformationRequest = QueryApplicationArgs;

// Get application response type
// TODO: Account for application types
export type GetReviewInformationResponse = {
  application: Pick<Application, 'id' | 'type'> & {
    guardian: Pick<Applicant, 'guardian'>;
  };
};
