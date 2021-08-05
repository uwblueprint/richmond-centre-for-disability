import { gql } from '@apollo/client'; // gql tag
import { MutationVerifyIdentityArgs, VerifyIdentityResult } from '@lib/types'; // GraphQL types

// Identity verification mutation
export const VERIFY_IDENTITY_MUTATION = gql`
  mutation VerifyIdentityMutation($input: VerifyIdentityInput!) {
    verifyIdentity(input: $input) {
      ok
      failureReason
      applicantId
    }
  }
`;

// Identity verification mutation arguments
export type VerifyIdentityRequest = MutationVerifyIdentityArgs;

// Identity verification mutation response
export type VerifyIdentityResponse = {
  verifyIdentity: VerifyIdentityResult;
};
