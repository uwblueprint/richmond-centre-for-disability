import { gql } from '@apollo/client'; // GraphQL queries
import { Scalars, UpdateApplicationProcessingResult, ApplicationStatus } from '@lib/graphql/types';

// TODO: DEPRECATED REPLACE WITH approveApplication

export const APPROVE_APPLICATION_MUTATION = gql`
  mutation approveApplication($applicationId: ID!) {
    updateApplicationProcessing(input: {applicationId: $applicationId, status: ${ApplicationStatus.Approved}}) {
      ok
    }
  }
`;

// Approve application request type
export type ApproveApplicationRequest = {
  applicationId: Scalars['ID'];
};

// Approve application response type
export type ApproveApplicationResponse = {
  updateApplicationProcessing: UpdateApplicationProcessingResult;
};
