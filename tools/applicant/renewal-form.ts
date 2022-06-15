import { gql } from '@apollo/client'; // gql tag
import {
  CreateExternalRenewalApplicationResult,
  MutationCreateExternalRenewalApplicationArgs,
} from '@lib/graphql/types'; // GraphQL types

// Create external renewal application mutation
export const CREATE_EXTERNAL_RENEWAL_APPLICATION_MUTATION = gql`
  mutation CreateExternalRenewalApplicationMutation(
    $input: CreateExternalRenewalApplicationInput!
  ) {
    createExternalRenewalApplication(input: $input) {
      ok
      applicationId
      error
      checkoutUrl
    }
  }
`;

// Create renewal application mutation arguments
export type CreateExternalRenewalApplicationRequest = MutationCreateExternalRenewalApplicationArgs;

// Create renewal application mutation result
export type CreateExternalRenewalApplicationResponse = {
  createExternalRenewalApplication: CreateExternalRenewalApplicationResult;
};

/** Current step of renewal flow */
export enum Step {
  IDENTITY_VERIFICATION,
  RENEWAL_FORM,
}
