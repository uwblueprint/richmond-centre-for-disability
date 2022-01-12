import { gql } from '@apollo/client';
import { Applicant, Application, Physician, Renewal } from '@lib/graphql/types';

/** Query applicant for create renewal flow */
export const GET_APPLICANT_RENEWAL_QUERY = gql`
  query getApplicantRenewal($id: Int!) {
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
      medicalInformation {
        physician {
          name
          mspNumber
          addressLine1
          addressLine2
          city
          postalCode
          phone
        }
      }
      mostRecentRenewal {
        id
        receiveEmailUpdates
        shippingFullName
        shippingAddressLine1
        shippingAddressLine2
        shippingCity
        shippingProvince
        shippingPostalCode
        shippingAddressSameAsHomeAddress
        renewal {
          usesAccessibleConvertedVan
          requiresWiderParkingSpace
        }
      }
    }
  }
`;

// Get Applicant Renewal Application Request
export type GetApplicantRenewalRequest = Pick<Applicant, 'id'>;

// Get Applicant Renewal Application Response
export type GetApplicantRenewalResponse = {
  applicant: Pick<
    Applicant,
    | 'id'
    | 'firstName'
    | 'lastName'
    | 'email'
    | 'phone'
    | 'addressLine1'
    | 'addressLine2'
    | 'city'
    | 'postalCode'
    | 'rcdUserId'
    | 'dateOfBirth'
    | 'status'
    | 'gender'
    | 'province'
  > & {
    medicalInformation: {
      physician: Pick<
        Physician,
        'name' | 'mspNumber' | 'addressLine1' | 'addressLine2' | 'city' | 'postalCode' | 'phone'
      >;
    };
  } & {
    mostRecentRenewal: Pick<
      Application,
      | 'id'
      | 'receiveEmailUpdates'
      | 'shippingFullName'
      | 'shippingAddressLine1'
      | 'shippingAddressLine2'
      | 'shippingCity'
      | 'shippingProvince'
      | 'shippingPostalCode'
      | 'shippingAddressSameAsHomeAddress'
    > & {
      renewal: Pick<Renewal, 'usesAccessibleConvertedVan' | 'requiresWiderParkingSpace'>;
    };
  };
};
