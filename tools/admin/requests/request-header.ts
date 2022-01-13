import { gql } from '@apollo/client'; // GraphQL queries
import {
  ApproveApplicationResult,
  CompleteApplicationResult,
  MutationApproveApplicationArgs,
  MutationCompleteApplicationArgs,
  MutationRejectApplicationArgs,
  RejectApplicationResult,
} from '@lib/graphql/types';

export const APPROVE_APPLICATION_MUTATION = gql`
  mutation approveApplication($id: Int!) {
    approveApplication(input: { id: $id }) {
      ok
    }
  }
`;

// Approve application request type
export type ApproveApplicationRequest = MutationApproveApplicationArgs;

// Approve application response type
export type ApproveApplicationResponse = {
  approveApplication: ApproveApplicationResult;
};

export const REJECT_APPLICATION_MUTATION = gql`
  mutation rejectApplication($id: Int!) {
    rejectApplication(input: { id: $id }) {
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

export const COMPLETE_APPLICATION_MUTATION = gql`
  mutation completeApplication($id: Int!) {
    completeApplication(id: $id) {
      ok
    }
  }
`;

// Complete application request type
export type CompleteApplicationRequest = MutationCompleteApplicationArgs;

// Complete application response type
export type CompleteApplicationResponse = {
  completeApplication: CompleteApplicationResult;
};
