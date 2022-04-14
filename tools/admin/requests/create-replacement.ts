import { gql } from '@apollo/client'; // gql tag
import {
  CreateReplacementApplicationResult,
  MutationCreateReplacementApplicationArgs,
} from '@lib/graphql/types'; // GraphQL types
import { ReasonForReplacementFormData } from '@tools/admin/requests/reason-for-replacement';

/** Create replacement application mutation */
export const CREATE_REPLACEMENT_APPLICATION_MUTATION = gql`
  mutation CreateReplacementApplicationMutation($input: CreateReplacementApplicationInput!) {
    createReplacementApplication(input: $input) {
      ok
      applicationId
    }
  }
`;

// Create replacement application mutation arguments
export type CreateReplacementApplicationRequest = MutationCreateReplacementApplicationArgs;

// Create replacement application mutation result
export type CreateReplacementApplicationResponse = {
  createReplacementApplication: CreateReplacementApplicationResult;
};

/** Initial reason for replacement form values */
export const INITIAL_REASON_FOR_REPLACEMENT: ReasonForReplacementFormData = {
  reason: null,
  lostTimestamp: null,
  lostLocation: null,
  stolenJurisdiction: null,
  stolenPoliceOfficerName: null,
  stolenPoliceFileNumber: null,
  eventDescription: null,
};
