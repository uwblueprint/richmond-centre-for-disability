import { gql } from '@apollo/client'; // gql tag
import { MutationUpdateApplicantArgs, UpdateApplicantResult } from '@lib/types'; // GraphQL types

// Update applicant mutation
export const UPDATE_APPLICANT_MUTATION = gql`
  mutation UpdateApplicant($input: UpdateApplicantInput!) {
    updateApplicant(input: $input) {
      ok
    }
  }
`;

// Update applicant mutation arguments
export type UpdateApplicantRequest = MutationUpdateApplicantArgs;

// Update applicant mutation response
export type UpdateApplicantResponse = {
  updateApplicant: UpdateApplicantResult;
};