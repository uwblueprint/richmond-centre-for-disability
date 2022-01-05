import { gql } from '@apollo/client';
import {
  MutationUpdateApplicationProcessingArgs,
  UpdateApplicationProcessingResult,
} from '@lib/graphql/types';

export const UPDATE_APPLICATION_PROCESSING_MUTATION = gql`
  mutation updateApplicationProcessing($input: UpdateApplicationProcessingInput!) {
    updateApplicationProcessing(input: $input) {
      ok
    }
  }
`;

// Update application processing request type
export type UpdateApplicationProcessingRequest = MutationUpdateApplicationProcessingArgs;

// Update application processing response type
export type UpdateApplicationProcessingResponse = {
  updateApplicationProcessing: UpdateApplicationProcessingResult;
};
