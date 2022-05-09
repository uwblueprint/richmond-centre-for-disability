import { gql } from '@apollo/client';
import { MutationUpdateApplicantNotesArgs, UpdateApplicantNotesResult } from '@lib/graphql/types';

/** Update additional notes section */
export const UPDATE_APPLICANT_NOTES = gql`
  mutation UpdateApplicantNotes($input: UpdateApplicantNotesInput!) {
    updateApplicantNotes(input: $input) {
      ok
    }
  }
`;

export type UpdateApplicantNotesRequest = MutationUpdateApplicantNotesArgs;

export type UpdateApplicantNotesResponse = {
  updateApplicantNotes: UpdateApplicantNotesResult;
};
