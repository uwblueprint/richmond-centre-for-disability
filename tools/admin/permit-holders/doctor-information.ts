import { gql } from '@apollo/client';
import {
  MutationUpdateApplicantDoctorInformationArgs,
  Physician,
  QueryApplicantArgs,
} from '@lib/graphql/types';

/** Doctor information in doctor information form */
export type DoctorFormData = Pick<
  Physician,
  | 'firstName'
  | 'lastName'
  | 'phone'
  | 'addressLine1'
  | 'addressLine2'
  | 'city'
  | 'postalCode'
  | 'mspNumber'
>;

/** Doctor information in doctor information card */
export type DoctorCardData = Pick<
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

/** Row in previous doctor information modal */
export type PreviousDoctorRow = {
  name: {
    firstName: string;
    lastName: string;
  };
  phone: string;
  mspNumber: string;
  applicationId: number;
};

/** Get the physician information of an applicant */
export const GET_DOCTOR_INFORMATION = gql`
  query GetDoctorInformation($id: Int!) {
    applicant(id: $id) {
      id
      medicalInformation {
        physician {
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
      completedApplications {
        __typename
        id
        type
        ... on NewApplication {
          physicianFirstName
          physicianLastName
          physicianPhone
          physicianMspNumber
        }
        ... on RenewalApplication {
          physicianFirstName
          physicianLastName
          physicianPhone
          physicianMspNumber
        }
      }
    }
  }
`;

export type GetDoctorInformationRequest = QueryApplicantArgs;

type CompletedApplication =
  | {
      id: number;
      type: 'NEW' | 'RENEWAL';
      physicianFirstName: string;
      physicianLastName: string;
      physicianPhone: string;
      physicianMspNumber: string;
    }
  | {
      id: number;
      type: 'REPLACEMENT';
    };

export type GetDoctorInformationResponse = {
  applicant: {
    medicalInformation: {
      physician: DoctorCardData;
    };
    completedApplications: CompletedApplication[];
  };
};

/** Update applicant doctor information (upsert if not exists) */
export const UPDATE_DOCTOR_INFORMATION = gql`
  mutation UpdateApplicantDoctorInformation($input: UpdateApplicantDoctorInformationInput!) {
    updateApplicantDoctorInformation(input: $input) {
      ok
      error
    }
  }
`;

export type UpdateDoctorInformationRequest = MutationUpdateApplicantDoctorInformationArgs;

export type UpdateDoctorInformationResponse = {
  updateApplicantDoctorInformation: UpdateDoctorInformationRequest;
};
