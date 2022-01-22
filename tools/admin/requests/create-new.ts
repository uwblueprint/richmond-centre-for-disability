import { gql } from '@apollo/client';
import { Applicant, Guardian, Physician, QueryApplicantArgs } from '@lib/graphql/types';

export const GET_APPLICANT_NEW_REQUEST_INFO_QUERY = gql`
  query GetApplicantNewRequestInfo($id: Int!) {
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
      guardian {
        firstName
        middleName
        lastName
        phone
        relationship
        addressLine1
        addressLine2
        city
        postalCode
      }
    }
  }
`;

export type GetApplicantNewRequestInfoRequest = QueryApplicantArgs;

export type GetApplicantNewRequestInfoResponse = {
  applicant: Pick<
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
  } & {
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
      | 'postalCode'
    >;
  };
};
