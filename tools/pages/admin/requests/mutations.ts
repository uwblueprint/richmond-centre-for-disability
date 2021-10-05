import { gql } from '@apollo/client'; // GraphQL queries
import { ApplicationStatus } from '@lib/types'; // Types

// Update Application by ID and optional parameters
export const UPDATE_APPLICATION_MUTATION = gql`
  mutation updateApplication($input: UpdateApplicationInput!) {
    updateApplication(input: $input) {
      ok
    }
  }
`;

// Approve Application Processing object with provided ID
export const APPROVE_APPLICATION_MUTATION = gql`
  mutation approveApplication($applicationId: ID!) {
    updateApplicationProcessing(input: {applicationId: $applicationId, status: ${ApplicationStatus.Approved}}) {
      ok
    }
  }
`;

// Reject Application Processing object with provided ID
export const REJECT_APPLICATION_MUTATION = gql`
  mutation rejectApplication($applicationId: ID!) {
    updateApplicationProcessing(input: {applicationId: $applicationId, status: ${ApplicationStatus.Rejected}}) {
      ok
    }
  }
`;

// Complete Application with provided ID
export const COMPLETE_APPLICATION_MUTATION = gql`
  mutation completeApplication($applicationId: ID!) {
    completeApplication(applicationId: $applicationId) {
      ok
    }
  }
`;

// Update Application Processing object with provided ID and optional parameters
export const UPDATE_APPLICATION_PROCESSING_MUTATION = gql`
  mutation updateApplicationProcessing($input: UpdateApplicationProcessingInput!) {
    updateApplicationProcessing(input: $input) {
      ok
    }
  }
`;
