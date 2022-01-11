import { gql } from '@apollo/client'; // gql tag
import { MutationUpdateMedicalInformationArgs, UpdateMedicalInformationResult } from '@lib/types'; // GraphQL types

// TODO: FIX AND REPLACE WITH UPDATE PHYSICIAN

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
