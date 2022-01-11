import { gql } from '@apollo/client'; // GraphQL queries
import { Scalars, CompleteApplicationResult } from '@lib/graphql/types';

export const COMPLETE_APPLICATION_MUTATION = gql`
  mutation completeApplication($applicationId: ID!) {
    completeApplication(applicationId: $applicationId) {
      ok
    }
  }
`;

// Complete application request type
export type CompleteApplicationRequest = {
  applicationId: Scalars['ID'];
};

// Complete application response type
export type CompleteApplicationResponse = {
  completeApplication: CompleteApplicationResult;
};
