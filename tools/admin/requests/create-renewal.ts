import { gql } from '@apollo/client';
import {
  Applicant,
  CreateRenewalApplicationResult,
  MutationCreateRenewalApplicationArgs,
  Physician,
  QueryApplicantArgs,
} from '@lib/graphql/types';

/** Get applicant autofill information */
export const GET_RENEWAL_APPLICANT = gql`
  query GetRenewalApplicant($id: Int!) {
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
      receiveEmailUpdates
      addressLine1
      addressLine2
      city
      postalCode
      medicalInformation {
        physician {
          firstName
          lastName
          mspNumber
          phone
          addressLine1
          addressLine2
          city
          postalCode
        }
      }
    }
  }
`;

export type GetRenewalApplicantRequest = QueryApplicantArgs;

export type GetRenewalApplicantResponse = {
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
    | 'receiveEmailUpdates'
    | 'addressLine1'
    | 'addressLine2'
    | 'city'
    | 'postalCode'
  > & {
    medicalInformation: {
      physician: Pick<
        Physician,
        | 'firstName'
        | 'lastName'
        | 'mspNumber'
        | 'phone'
        | 'addressLine1'
        | 'addressLine2'
        | 'city'
        | 'postalCode'
      >;
    };
  };
};

// Create renewal application mutation
export const CREATE_RENEWAL_APPLICATION_MUTATION = gql`
  mutation CreateApplicationMutation($input: CreateRenewalApplicationInput!) {
    createRenewalApplication(input: $input) {
      ok
      applicationId
      error
    }
  }
`;

// Create renewal application mutation arguments
export type CreateRenewalApplicationRequest = MutationCreateRenewalApplicationArgs;

// Create renewal application mutation result
export type CreateRenewalApplicationResponse = {
  createRenewalApplication: CreateRenewalApplicationResult;
};
