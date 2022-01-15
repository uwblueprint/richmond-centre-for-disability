import { gql } from '@apollo/client';
import {
  MutationUpdateApplicationReasonForReplacementArgs,
  QueryApplicantArgs,
  ReasonForReplacement,
  ReplacementApplication,
  UpdateApplicationReasonForReplacementResult,
} from '@lib/graphql/types'; // Physician type

/** Reason for replacement form */
export type ReasonForReplacementFormData = Pick<
  ReplacementApplication,
  | 'lostTimestamp'
  | 'lostLocation'
  | 'eventDescription'
  | 'stolenPoliceFileNumber'
  | 'stolenJurisdiction'
  | 'stolenPoliceOfficerName'
> & { reason: ReasonForReplacement | null };

/** Get reason for replacement section of an application */
export const GET_REASON_FOR_REPLACEMENT = gql`
  query GetReasonForReplacement($id: Int!) {
    application(id: $id) {
      __typename
      ... on ReplacementApplication {
        reason
        lostTimestamp
        lostLocation
        eventDescription
        stolenJurisdiction
        stolenPoliceFileNumber
        stolenPoliceOfficerName
      }
    }
  }
`;

export type GetReasonForReplacementRequest = QueryApplicantArgs;

export type GetReasonForReplacementResponse = {
  application: Pick<
    ReplacementApplication,
    | 'reason'
    | 'lostTimestamp'
    | 'lostLocation'
    | 'eventDescription'
    | 'stolenJurisdiction'
    | 'stolenPoliceFileNumber'
    | 'stolenPoliceOfficerName'
  >;
};

/** Update reason for replacement */
export const UPDATE_REASON_FOR_REPLACEMENT = gql`
  mutation UpdateReasonForReplacement($input: UpdateApplicationReasonForReplacementInput!) {
    updateApplicationReasonForReplacement(input: $input) {
      ok
    }
  }
`;

export type UpdateReasonForReplacementRequest = MutationUpdateApplicationReasonForReplacementArgs;

export type UpdateReasonForReplacementResponse = {
  updateApplicationReasonForReplacement: UpdateApplicationReasonForReplacementResult;
};
