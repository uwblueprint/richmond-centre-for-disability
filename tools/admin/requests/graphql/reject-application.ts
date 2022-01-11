import { gql } from '@apollo/client'; // GraphQL queries
import { Scalars, UpdateApplicationProcessingResult, ApplicationStatus } from '@lib/graphql/types';

export const REJECT_APPLICATION_MUTATION = gql`
  mutation rejectApplication($applicationId: ID!) {
    updateApplicationProcessing(input: {applicationId: $applicationId, status: ${ApplicationStatus.Rejected}}) {
      ok
    }
  }
`;

// Reject application request type
export type RejectApplicationRequest = {
  applicationId: Scalars['ID'];
};

// Reject application response type
export type RejectApplicationResponse = {
  updateApplicationProcessing: UpdateApplicationProcessingResult;
};
