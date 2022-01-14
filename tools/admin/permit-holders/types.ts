import { Applicant } from '@lib/graphql/types';

// TODO: Deprecate
//Applicant data to show in Personal Information Card component
export type ApplicantData = Pick<
  Applicant,
  | 'id'
  | 'rcdUserId'
  | 'firstName'
  | 'lastName'
  | 'gender'
  | 'dateOfBirth'
  | 'email'
  | 'phone'
  | 'province'
  | 'city'
  | 'addressLine1'
  | 'addressLine2'
  | 'postalCode'
  | 'status'
>;
