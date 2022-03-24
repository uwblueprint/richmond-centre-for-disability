import { gql } from '@apollo/client'; // GraphQL queries
import { Application, QueryApplicationArgs } from '@lib/graphql/types';

// Queries an Application by ID along with the associated permit, replacement, applicationProcessing, and applicant
export const GET_REVIEW_INFORMATION_QUERY = gql`
  query GetApplication($id: Int!) {
    application(id: $id) {
      type
    }
  }
`;

/** Get application request type */
export type GetReviewInformationRequest = QueryApplicationArgs;

/** Get application response type */
export type GetReviewInformationResponse = {
  application: Pick<Application, 'type'>;
};
