import { gql } from '@apollo/client';
import {
  MutationUpdateApplicationGuardianInformationArgs,
  Province,
  QueryApplicationArgs,
  UpdateApplicationGuardianInformationResult,
} from '@lib/graphql/types';

/** Guardian information in forms */
export type GuardianInformation = {
  omitGuardianPoa: boolean;
  firstName: string;
  middleName: string | null;
  lastName: string;
  relationship: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  postalCode: string;
  poaFormS3ObjectKey: string | null;
};

/** Guardian information for cards */
export type GuardianCardData = {
  firstName: string;
  middleName: string | null;
  lastName: string;
  relationship: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  province: Province;
  country: string;
  postalCode: string;
  poaFormS3ObjectKey: string | null;
};

/**
 * Get the guardian information of an application
 * ! New application is expected when running this query
 */
export const GET_GUARDIAN_INFORMATION = gql`
  query GetGuardianInformation($id: Int!) {
    application(id: $id) {
      __typename
      id
      type
      ... on NewApplication {
        firstName: guardianFirstName
        middleName: guardianMiddleName
        lastName: guardianLastName
        relationship: guardianRelationship
        phone: guardianPhone
        addressLine1: guardianAddressLine1
        addressLine2: guardianAddressLine2
        city: guardianCity
        province: guardianProvince
        country: guardianCountry
        postalCode: guardianPostalCode
        poaFormS3ObjectKey
      }
    }
  }
`;

export type GetGuardianInformationRequest = QueryApplicationArgs;

export type GetGuardianInformationResponse = {
  application: GuardianCardData;
};

/** Update guardian information of application */
export const UPDATE_GUARDIAN_INFORMATION = gql`
  mutation UpdateApplicationGuardianInformation(
    $input: UpdateApplicationGuardianInformationInput!
  ) {
    updateApplicationGuardianInformation(input: $input) {
      ok
    }
  }
`;

export type UpdateGuardianInformationRequest = MutationUpdateApplicationGuardianInformationArgs;

export type UpdateGuardianInformationResponse = {
  updateApplicationGuardianInformation: UpdateApplicationGuardianInformationResult;
};
