import { gql } from '@apollo/client';
import { MutationUpdateNewApplicationGeneralInformationArgs } from '@lib/graphql/types';
import {
  Applicant,
  Application,
  Permit,
  NewApplication,
  QueryApplicationArgs,
  MutationUpdateApplicationGeneralInformationArgs,
  UpdateApplicationGeneralInformationResult,
  QueryApplicantArgs,
} from '@lib/graphql/types'; // Applicant type

/** Permit holder information for forms */
export type PermitHolderFormData = Pick<
  Application,
  | 'firstName'
  | 'middleName'
  | 'lastName'
  | 'email'
  | 'phone'
  | 'receiveEmailUpdates'
  | 'addressLine1'
  | 'addressLine2'
  | 'city'
  | 'postalCode'
> &
  (
    | // New application
    ({ type: 'NEW' } & Pick<NewApplication, 'dateOfBirth' | 'gender' | 'otherGender'>)

    // Renewal/replacement application
    | {
        type: 'RENEWAL' | 'REPLACEMENT';
      }
  );

export type NewApplicationPermitHolderFormData = Pick<
  NewApplication,
  | 'firstName'
  | 'middleName'
  | 'lastName'
  | 'email'
  | 'phone'
  | 'receiveEmailUpdates'
  | 'addressLine1'
  | 'addressLine2'
  | 'city'
  | 'postalCode'
  | 'dateOfBirth'
  | 'gender'
  | 'otherGender'
>;

/** Permit holder information for cards */
export type PermitHolderCardData = Pick<
  Application,
  | 'firstName'
  | 'middleName'
  | 'lastName'
  | 'receiveEmailUpdates'
  | 'phone'
  | 'email'
  | 'addressLine1'
  | 'addressLine2'
  | 'city'
  | 'province'
  | 'country'
  | 'postalCode'
> &
  (
    | // New application
    ({ type: 'NEW'; applicant: null } & Partial<
        Pick<NewApplication, 'dateOfBirth' | 'gender' | 'otherGender' | 'receiveEmailUpdates'>
      >)
    // Renewal/replacement application
    | {
        type: 'RENEWAL' | 'REPLACEMENT';
        applicant: Pick<Applicant, 'id' | 'dateOfBirth' | 'gender' | 'otherGender'> & {
          mostRecentPermit: Pick<Permit, 'expiryDate' | 'rcdPermitId'> | null;
        };
      }
  );

/** Get the applicant information of an application */
export const GET_APPLICANT_INFORMATION = gql`
  query GetApplicantInformation($id: Int!) {
    application(id: $id) {
      __typename
      id
      type
      firstName
      middleName
      lastName
      phone
      email
      addressLine1
      addressLine2
      city
      province
      country
      postalCode
      ... on NewApplication {
        dateOfBirth
        gender
        otherGender
      }
      applicant {
        id
        dateOfBirth
        gender
        otherGender
        receiveEmailUpdates
        mostRecentPermit {
          expiryDate
          rcdPermitId
        }
      }
    }
  }
`;

export type GetApplicantInformationRequest = QueryApplicationArgs;

export type GetApplicantInformationResponse = {
  application: PermitHolderCardData;
};

/** Update permit holder information of application */
export const UPDATE_PERMIT_HOLDER_INFORMATION = gql`
  mutation UpdateApplicationPermitHolderInformation(
    $input: UpdateApplicationGeneralInformationInput!
  ) {
    updateApplicationGeneralInformation(input: $input) {
      ok
    }
  }
`;

export type UpdatePermitHolderInformationRequest = MutationUpdateApplicationGeneralInformationArgs;

export type UpdatePermitHolderInformationResponse = {
  updateApplicationGeneralInformation: UpdateApplicationGeneralInformationResult;
};

/** Update permit holder information of application */
export const UPDATE_NEW_PERMIT_HOLDER_INFORMATION = gql`
  mutation UpdateNewApplicationPermitHolderInformation(
    $input: UpdateNewApplicationGeneralInformationInput!
  ) {
    updateNewApplicationGeneralInformation(input: $input) {
      ok
    }
  }
`;

export type UpdateNewPermitHolderInformationRequest =
  MutationUpdateNewApplicationGeneralInformationArgs;

/** Get permit holder information for selected permit holder preview card */
export const GET_SELECTED_APPLICANT_QUERY = gql`
  query GetSelectedApplicant($id: Int!) {
    applicant(id: $id) {
      firstName
      middleName
      lastName
      status
      dateOfBirth
      gender
      otherGender
      phone
      email
      addressLine1
      addressLine2
      city
      province
      country
      postalCode
    }
  }
`;

export type GetSelectedApplicantRequest = QueryApplicantArgs;

export type GetSelectedApplicantResponse = {
  applicant: Pick<
    Applicant,
    | 'firstName'
    | 'middleName'
    | 'lastName'
    | 'status'
    | 'dateOfBirth'
    | 'gender'
    | 'otherGender'
    | 'phone'
    | 'email'
    | 'addressLine1'
    | 'addressLine2'
    | 'city'
    | 'province'
    | 'country'
    | 'postalCode'
  >;
};
