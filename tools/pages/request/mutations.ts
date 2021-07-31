import { gql } from '@apollo/client'; // GraphQL queries
import { ApplicationStatus } from '@lib/types'; // Types

// Update Application by ID and optional parameters
export const UPDATE_APPLICATION = gql`
  mutation updateApplication($input: UpdateApplicationInput!) {
    updateApplication(input: $input) {
      ok
    }
  }
`;

// Approve Application Processing object with provided ID
export const APPROVE_APPLICATION = gql`
  mutation ApproveApplication($id: ID!) {
    updateApplicationProcessing(input: {id: $id, status: ${ApplicationStatus.Approved}}) {
      ok
    }
  }
`;

// Reject Application Processing object with provided ID
export const REJECT_APPLICATION = gql`
  mutation RejectApplication($id: ID!) {
    updateApplicationProcessing(input: {id: $id, status: ${ApplicationStatus.Rejected}}) {
      ok
    }
  }
`;

// Update Application Processing object with provided ID and optional parameters
export const UPDATE_APPLICATION_PROCESSING = gql`
  mutation updateApplicationProcessing($input: UpdateApplicationProcessingInput!) {
    updateApplicationProcessing(input: $input) {
      ok
    }
  }
`;
