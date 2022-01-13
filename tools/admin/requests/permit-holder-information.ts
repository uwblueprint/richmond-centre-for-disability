import { gql } from '@apollo/client';
import {
  Applicant,
  Application,
  Permit,
  NewApplication,
  QueryApplicationArgs,
  MutationUpdateApplicationGeneralInformationArgs,
  UpdateApplicationGeneralInformationResult,
  Gender,
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
>;

/** Get the applicant information of an application */
export const GET_APPLICANT_INFORMATION = gql`
  query GetApplicantInformation($id: Int!) {
    application(id: $id) {
      __typename
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
        rcdUserId
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
  application: Pick<
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
          applicant: Pick<
            Applicant,
            'id' | 'rcdUserId' | 'dateOfBirth' | 'gender' | 'otherGender'
          > & {
            mostRecentPermit: Pick<Permit, 'expiryDate' | 'rcdPermitId'> | null;
          };
        }
    );
};

/** Update permit holder information of application */
export const UPDATE_PERMIT_HOLDER_INFORMATION = gql`
  mutation UpdatePermitHolderInformation($input: UpdateApplicationGeneralInformationInput!) {
    updateApplicationGeneralInformation(input: $input) {
      ok
    }
  }
`;

export type UpdatePermitHolderInformationRequest = MutationUpdateApplicationGeneralInformationArgs;

export type UpdatePermitHolderInformationResponse = {
  updateApplicationGeneralInformation: UpdateApplicationGeneralInformationResult;
};
