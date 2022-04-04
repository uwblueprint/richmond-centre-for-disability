import { gql } from '@apollo/client';
import {
  Applicant,
  CreateNewApplicationResult,
  Guardian,
  MutationCreateNewApplicationArgs,
  Physician,
  QueryApplicantArgs,
} from '@lib/graphql/types';
import { AdditionalInformationFormData } from '@tools/admin/requests/additional-questions';
import { DoctorFormData } from '@tools/admin/requests/doctor-information';
import { GuardianInformation } from '@tools/admin/requests/guardian-information';
import { PaymentInformationFormData } from '@tools/admin/requests/payment-information';
import { NewApplicationPermitHolderInformation } from '@tools/admin/requests/permit-holder-information';
import { PhysicianAssessment } from '@tools/admin/requests/physician-assessment';

/** Gen applicant information to autofill new application forms */
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
    > | null;
  };
};

/** Create new application mutation */
export const CREATE_NEW_APPLICATION_MUTATION = gql`
  mutation CreateNewApplicationMutation($input: CreateNewApplicationInput!) {
    createNewApplication(input: $input) {
      ok
      applicationId
    }
  }
`;

// Create new application mutation arguments
export type CreateNewApplicationRequest = MutationCreateNewApplicationArgs;

// Create new application mutation result
export type CreateNewApplicationResponse = {
  createNewApplication: CreateNewApplicationResult;
};

// Initial data for permit holder information in application form
export const INITIAL_PERMIT_HOLDER_INFORMATION: NewApplicationPermitHolderInformation = {
  firstName: '',
  middleName: '',
  lastName: '',
  dateOfBirth: '',
  gender: null,
  otherGender: null,
  email: '',
  phone: '',
  receiveEmailUpdates: false,
  addressLine1: '',
  addressLine2: '',
  city: '',
  postalCode: '',
};

// Initial data for physician assessment in application forms
export const INITIAL_PHYSICIAN_ASSESSMENT: PhysicianAssessment = {
  disability: '',
  patientCondition: null,
  permitType: null,
  disabilityCertificationDate: '',
  otherPatientCondition: null,
  temporaryPermitExpiry: null,
};

// Initial data for doctor information in application forms
export const INITIAL_DOCTOR_INFORMATION: DoctorFormData = {
  firstName: '',
  lastName: '',
  mspNumber: null,
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  postalCode: '',
};

// Initial data for guardian information in application forms
export const INITIAL_GUARDIAN_INFORMATION: GuardianInformation = {
  omitGuardianPoa: false,
  firstName: '',
  middleName: '',
  lastName: '',
  relationship: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  postalCode: '',
  poaFormS3ObjectKey: '',
};

// Initial data for additional questions in application forms
export const INITIAL_ADDITIONAL_QUESTIONS: AdditionalInformationFormData = {
  usesAccessibleConvertedVan: null,
  accessibleConvertedVanLoadingMethod: null,
  requiresWiderParkingSpace: null,
  requiresWiderParkingSpaceReason: null,
  otherRequiresWiderParkingSpaceReason: null,
};

// Initial data for initial payment details in application forms
export const INITIAL_PAYMENT_DETAILS: PaymentInformationFormData = {
  paymentMethod: null,
  donationAmount: '',
  shippingAddressSameAsHomeAddress: false,
  shippingFullName: '',
  shippingAddressLine1: '',
  shippingAddressLine2: '',
  shippingCity: '',
  shippingProvince: null,
  shippingCountry: '',
  shippingPostalCode: '',
  billingAddressSameAsHomeAddress: false,
  billingFullName: '',
  billingAddressLine1: '',
  billingAddressLine2: '',
  billingCity: '',
  billingProvince: null,
  billingCountry: 'Canada',
  billingPostalCode: '',
};
