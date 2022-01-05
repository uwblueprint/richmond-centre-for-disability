import { gql } from '@apollo/client'; // GraphQL queries
import { MutationUpdateApplicationArgs, UpdateApplicationResult } from '@lib/graphql/types';

// Update Application by ID and optional parameters
export const UPDATE_APPLICATION_MUTATION = gql`
  mutation updateApplication($input: UpdateApplicationInput!) {
    updateApplication(input: $input) {
      ok
    }
  }
`;

// Update application request type
export type UpdateApplicationRequest = MutationUpdateApplicationArgs;

// Update application response type
export type UpdateApplicationResponse = {
  updateApplication: UpdateApplicationResult;
};
