import { gql } from '@apollo/client';
import { Province, QueryApplicationArgs } from '@lib/graphql/types';

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
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  relationship: string | null;
  phone: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  province: Province | null;
  country: string | null;
  postalCode: string | null;
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
      }
    }
  }
`;

export type GetGuardianInformationRequest = QueryApplicationArgs;

export type GetGuardianInformationResponse = {
  application: GuardianCardData;
};
