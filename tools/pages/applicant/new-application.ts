import { gql } from '@apollo/client'; // gql tag
import { CreateApplicationResult, MutationCreateApplicationArgs } from '@lib/graphql/types'; // GraphQL types

// Create replacement application mutation
export const CREATE_APPLICATION_MUTATION = gql`
  mutation CreateApplicationMutation($input: CreateApplicationInput!) {
    createApplication(input: $input) {
      ok
      applicationId
    }
  }
`;

// Create replacement application mutation arguments
export type CreateApplicationRequest = MutationCreateApplicationArgs;

// Create replacement application mutation result
export type CreateApplicationResponse = {
  createApplication: CreateApplicationResult;
};
