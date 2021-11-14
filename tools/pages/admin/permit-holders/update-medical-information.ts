import gql from 'graphql-tag'; // gql tag
import {
  MutationUpdateMedicalInformationArgs,
  UpdateMedicalInformationResult,
} from '@lib/graphql/types'; // GraphQL types

export const UPDATE_MEDICAL_INFORMATION_MUTATION = gql`
  mutation UpdateMedicalInformation($input: UpdateMedicalInformationInput!) {
    updateMedicalInformation(input: $input) {
      ok
    }
  }
`;

// Update medical information mutation arguments
export type UpdateMedicalInformationRequest = MutationUpdateMedicalInformationArgs;

// Update medical information mutation response
export type UpdateMedicalInformationResponse = {
  updateMedicalInformation: UpdateMedicalInformationResult;
};
