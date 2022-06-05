import { gql } from '@apollo/client';
import {
  Applicant,
  MutationUpdateApplicantGeneralInformationArgs,
  QueryApplicantArgs,
  UpdateApplicantGeneralInformationResult,
} from '@lib/graphql/types';

/** Applicant information in permit holder information form */
export type ApplicantFormData = Pick<
  Applicant,
  | 'firstName'
  | 'middleName'
  | 'lastName'
  | 'dateOfBirth'
  | 'gender'
  | 'phone'
  | 'email'
  | 'receiveEmailUpdates'
  | 'addressLine1'
  | 'addressLine2'
  | 'city'
  | 'postalCode'
>;

/** Applicant information in permit holder information card */
export type ApplicantCardData = Pick<
  Applicant,
  | 'firstName'
  | 'middleName'
  | 'lastName'
  | 'dateOfBirth'
  | 'gender'
  | 'otherGender'
  | 'phone'
  | 'email'
  | 'receiveEmailUpdates'
  | 'addressLine1'
  | 'addressLine2'
  | 'city'
  | 'province'
  | 'country'
  | 'postalCode'
>;

/** Get applicant data for permit holder information card */
export const GET_APPLICANT_QUERY = gql`
  query GetApplicantPersonalInformation($id: Int!) {
    applicant(id: $id) {
      firstName
      middleName
      lastName
      dateOfBirth
      gender
      otherGender
      phone
      email
      receiveEmailUpdates
      addressLine1
      addressLine2
      city
      province
      country
      postalCode
    }
  }
`;

export type GetApplicantRequest = QueryApplicantArgs;

export type GetApplicantResponse = {
  applicant: ApplicantCardData;
};

/** Update applicant general information */
export const UPDATE_APPLICANT_GENERAL_INFORMATION_MUTATION = gql`
  mutation UpdateApplicantGeneralInformation($input: UpdateApplicantGeneralInformationInput!) {
    updateApplicantGeneralInformation(input: $input) {
      ok
      error
    }
  }
`;

export type UpdateApplicantGeneralInformationRequest =
  MutationUpdateApplicantGeneralInformationArgs;

export type UpdateApplicantGeneralInformationResponse = {
  updateApplicantGeneralInformation: UpdateApplicantGeneralInformationResult;
};
