import { gql } from '@apollo/client';
import {
  ComparePhysiciansResult,
  MutationUpdateApplicationDoctorInformationArgs,
  NewApplication,
  Physician,
  QueryApplicationArgs,
  QueryComparePhysiciansArgs,
  RenewalApplication,
  UpdateApplicationDoctorInformationResult,
  QueryApplicantArgs,
} from '@lib/graphql/types'; // Physician type

/** Doctor type in doctor information forms */
export type DoctorFormData = {
  firstName: string;
  lastName: string;
  mspNumber: string;
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
      error
    }
  }
`;

export type UpdateDoctorInformationRequest = MutationUpdateApplicationDoctorInformationArgs;

export type UpdateDoctorInformationResponse = {
  updateApplicationDoctorInformation: UpdateApplicationDoctorInformationResult;
};

/** Compare application physician data to DB physician data */
export const COMPARE_DOCTOR_INFORMATION = gql`
  query CompareDoctorInformation($input: ComparePhysiciansInput!) {
    comparePhysicians(input: $input) {
      status
      existingPhysicianData {
        firstName
        lastName
        mspNumber
        phone
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

export type CompareDoctorInformationRequest = QueryComparePhysiciansArgs;

export type CompareDoctorInformationResponse = {
  comparePhysicians: Pick<ComparePhysiciansResult, 'status'> & {
    existingPhysicianData: Pick<
      Physician,
      | 'firstName'
      | 'lastName'
      | 'mspNumber'
      | 'phone'
      | 'addressLine1'
      | 'addressLine2'
      | 'city'
      | 'province'
      | 'country'
      | 'postalCode'
    >;
  };
};

export const GET_CURRENT_PHYSICIAN_MSP_NUMBER = gql`
  query GetCurrentPhysicianMspNumber($id: Int!) {
    applicant(id: $id) {
      medicalInformation {
        physician {
          mspNumber
        }
      }
    }
  }
`;

export type GetCurrentPhysicianMspNumberRequest = QueryApplicantArgs;

export type GetCurrentPhysicianMspNumberResponse = {
  applicant: {
    medicalInformation: {
      physician: Pick<Physician, 'mspNumber'>;
    };
  } | null;
};
