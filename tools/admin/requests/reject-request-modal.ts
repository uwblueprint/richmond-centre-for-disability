import { gql } from '@apollo/client';
import { MutationRejectApplicationArgs, RejectApplicationResult } from '@lib/graphql/types';

export const REJECT_APPLICATION_MUTATION = gql`
  mutation RejectApplication($input: RejectApplicationInput!) {
    rejectApplication(input: $input) {
      ok
    }
  }
`;

// Reject application request type
export type RejectApplicationRequest = MutationRejectApplicationArgs;

// Reject application response type
export type RejectApplicationResponse = {
  rejectApplication: RejectApplicationResult;
};
