import { gql } from '@apollo/client';
import {
  MutationUpdateApplicationDoctorInformationArgs,
  NewApplication,
  QueryApplicationArgs,
  RenewalApplication,
  UpdateApplicationDoctorInformationResult,
} from '@lib/graphql/types'; // Physician type

/** Doctor type in doctor information forms */
export type DoctorFormData = {
  firstName: string;
  lastName: string;
  mspNumber: number | null;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  postalCode: string;
};

/** Doctor type in doctor information cards */
export type DoctorCardData = Pick<
  NewApplication | RenewalApplication,
  | 'physicianFirstName'
  | 'physicianLastName'
  | 'physicianMspNumber'
  | 'physicianPhone'
  | 'physicianAddressLine1'
  | 'physicianAddressLine2'
  | 'physicianCity'
  | 'physicianProvince'
  | 'physicianCountry'
  | 'physicianPostalCode'
>;

/**
 * Get doctor information of an application
 * Note: Application should be NEW or RENEWAL type only
 */
export const GET_DOCTOR_INFORMATION = gql`
  query GetDoctorInformation($id: Int!) {
    application(id: $id) {
      __typename
      id
      type
      ... on NewApplication {
        physicianFirstName
        physicianLastName
        physicianMspNumber
        physicianPhone
        physicianAddressLine1
        physicianAddressLine2
        physicianCity
        physicianProvince
        physicianCountry
        physicianPostalCode
      }
      ... on RenewalApplication {
        physicianFirstName
        physicianLastName
        physicianMspNumber
        physicianPhone
        physicianAddressLine1
        physicianAddressLine2
        physicianCity
        physicianProvince
        physicianCountry
        physicianPostalCode
      }
    }
  }
`;

export type GetDoctorInformationRequest = QueryApplicationArgs;

export type GetDoctorInformationResponse = {
  application: DoctorCardData;
};

/** Update doctor information of application */
export const UPDATE_DOCTOR_INFORMATION = gql`
  mutation UpdateApplicationDoctorInformation($input: UpdateApplicationDoctorInformationInput!) {
    updateApplicationDoctorInformation(input: $input) {
      ok
    }
  }
`;

export type UpdateDoctorInformationRequest = MutationUpdateApplicationDoctorInformationArgs;

export type UpdateDoctorInformationResponse = {
  updateApplicationDoctorInformation: UpdateApplicationDoctorInformationResult;
};
