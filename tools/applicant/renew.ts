import { gql } from '@apollo/client'; // gql tag
import {
  CreateRenewalApplicationResult,
  MutationCreateRenewalApplicationArgs,
} from '@lib/graphql/types'; // GraphQL types

// Create renewal application mutation
export const CREATE_RENEWAL_APPLICATION_MUTATION = gql`
  mutation CreateApplicationMutation($input: CreateRenewalApplicationInput!) {
    createRenewalApplication(input: $input) {
      ok
      applicationId
    }
  }
`;

// Create renewal application mutation arguments
export type CreateRenewalApplicationRequest = MutationCreateRenewalApplicationArgs;

// Create renewal application mutation result
export type CreateRenewalApplicationResponse = {
  createRenewalApplication: CreateRenewalApplicationResult;
};
