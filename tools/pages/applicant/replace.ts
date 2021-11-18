import { gql } from '@apollo/client'; // gql tag
import { CreateReplacementApplicationResult, MutationCreateReplacementApplicationArgs } from '@lib/types'; // GraphQL types

// Create replacement application mutation
export const CREATE_REPLACEMENT_APPLICATION_MUTATION = gql`
  mutation CreateReplacementApplicationMutation($input: CreateReplacementApplicationInput!) {
    createReplacementApplication(input: $input) {
      ok
    }
  }
`;

// Create replacement application mutation arguments
export type CreateReplacementApplicationRequest = MutationCreateReplacementApplicationArgs;

// Create replacement application mutation result
export type CreateReplacementApplicationResponse = {
  createReplacementApplication: CreateReplacementApplicationResult;
};
