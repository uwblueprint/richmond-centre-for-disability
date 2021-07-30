import { gql } from '@apollo/client'; // GraphQL queries
import { ApplicationStatus } from '@lib/types'; // Types

export const APPROVE_APPLICATION = gql`
  mutation ApproveApplication($id: ID!) {
    updateApplicationProcessing(input: {id: $id, status: ${ApplicationStatus.Approved}}) {
      ok
    }
  }
`;

export const REJECT_APPLICATION = gql`
  mutation RejectApplication($id: ID!) {
    updateApplicationProcessing(input: {id: $id, status: ${ApplicationStatus.Rejected}}) {
      ok
    }
  }
`;

export const UPDATE_APPLICATION_PROCESSING = gql`
  mutation updateApplicationProcessing($input: UpdateApplicationProcessingInput!) {
    updateApplicationProcessing(input: $input) {
      ok
    }
  }
`;
