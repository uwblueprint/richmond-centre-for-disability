import { gql } from '@apollo/client';
import { Applicant, Application } from '@lib/graphql/types';

export const GET_APPLICANT_REPLACEMENT_QUERY = gql`
  query getApplicant($id: Int!) {
    applicant(id: $id) {
      firstName
      lastName
      email
      phone
      addressLine1
      addressLine2
      city
      postalCode
      id
      rcdUserId
      dateOfBirth
      status
      gender
      province
      mostRecentApplication {
        shippingAddressSameAsHomeAddress
        shippingFullName
        shippingAddressLine1
        shippingAddressLine2
        shippingCity
        shippingProvince
        shippingPostalCode
      }
    }
  }
`;

/**
 * Input parameters for fetching an applicant for replacement request
 */
export type GetApplicantReplacementRequest = Pick<Applicant, 'id'>;

/**
 * Response type for fetching an applicant for replacement request
 */
export type GetApplicantReplacementResponse = {
  applicant: Pick<
    Applicant,
    | 'firstName'
    | 'lastName'
    | 'email'
    | 'phone'
    | 'addressLine1'
    | 'addressLine2'
    | 'city'
    | 'postalCode'
    | 'rcdUserId'
    | 'id'
    | 'dateOfBirth'
    | 'status'
    | 'gender'
    | 'province'
  > & {
    mostRecentApplication: Pick<
      Application,
      | 'id'
      | 'shippingFullName'
      | 'shippingAddressLine1'
      | 'shippingAddressLine2'
      | 'shippingCity'
      | 'shippingProvince'
      | 'shippingPostalCode'
      | 'shippingAddressSameAsHomeAddress'
    >;
  };
};
