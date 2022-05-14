import { gql } from '@apollo/client';
import {
  Guardian,
  MutationUpdateApplicantGuardianInformationArgs,
  UpdateApplicantGuardianInformationResult,
} from '@lib/graphql/types';

/** Guardian information presented in card */
export type GuardianInformationCardData = Pick<
  Guardian,
  | 'firstName'
  | 'middleName'
  | 'lastName'
  | 'phone'
  | 'relationship'
  | 'addressLine1'
  | 'addressLine2'
  | 'city'
  | 'province'
  | 'country'
  | 'postalCode'
  | 'poaFormS3ObjectKey'
  | 'poaFormS3ObjectUrl'
>;

/** Update guardian information of an applicant */
export const UPDATE_GUARDIAN_INFORMATION = gql`
  mutation UpdateApplicantGuardianInformation($input: UpdateApplicantGuardianInformationInput!) {
    updateApplicantGuardianInformation(input: $input) {
      ok
    }
  }
`;

export type UpdateGuardianInformationRequest = MutationUpdateApplicantGuardianInformationArgs;

export type UpdateGuardianInformationResponse = {
  updateApplicantGuardianInformation: UpdateApplicantGuardianInformationResult;
};
