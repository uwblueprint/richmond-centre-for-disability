import { gql } from '@apollo/client';
import { Guardian, QueryApplicantArgs } from '@lib/graphql/types';

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
    > | null;
  };
};
