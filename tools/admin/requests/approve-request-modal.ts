import { gql } from '@apollo/client';
import { ApproveApplicationResult, MutationApproveApplicationArgs } from '@lib/graphql/types';

export const APPROVE_APPLICATION_MUTATION = gql`
  mutation approveApplication($input: ApproveApplicationInput!) {
    approveApplication(input: $input) {
      ok
      error
    }
  }
`;

// Approve application request type
export type ApproveApplicationRequest = MutationApproveApplicationArgs;

// Approve application response type
export type ApproveApplicationResponse = {
  approveApplication: ApproveApplicationResult;
};
