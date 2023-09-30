import { gql } from '@apollo/client';
import { DeleteApplicationResult, MutationDeleteApplicationArgs } from '@lib/graphql/types';

export const DELETE_APPLICATION_MUTATION = gql`
  mutation deleteApplication($input: DeleteApplicationInput!) {
    deleteApplication(input: $input) {
      ok
    }
  }
`;

// Delete application request type
export type DeleteApplicationRequest = MutationDeleteApplicationArgs;

// Delete application response type
export type DeleteApplicationResponse = {
  deleteApplication: DeleteApplicationResult;
};
