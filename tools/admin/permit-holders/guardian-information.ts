import { gql } from '@apollo/client';
import {
  Guardian,
  MutationUpdateApplicantGuardianInformationArgs,
  QueryApplicantArgs,
  UpdateApplicantGuardianInformationResult,
} from '@lib/graphql/types';

/** Get guardian information of an applicant */
export const GET_GUARDIAN_INFORMATION = gql`
  query GetApplicantGuardianInformation($id: Int!) {
    applicant(id: $id) {
      guardian {
        firstName
        middleName
        lastName
        phone
        relationship
        addressLine1
        addressLine2
        city
        province
        country
        postalCode
        poaFormS3ObjectKey
        poaFormS3ObjectUrl
      }
    }
  }
`;

export type GetGuardianInformationRequest = QueryApplicantArgs;

export type GetGuardianInformationResponse = {
  applicant: {
    guardian: Pick<
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
    > | null;
  };
};

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
