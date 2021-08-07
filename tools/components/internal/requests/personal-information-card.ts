import { Applicant } from '@lib/graphql/types'; // Applicant type

export type PersonalInformationCardApplicant = Pick<
  Applicant,
  | 'firstName'
  | 'lastName'
  | 'rcdUserId'
  | 'email'
  | 'phone'
  | 'addressLine1'
  | 'addressLine2'
  | 'city'
  | 'province'
  | 'postalCode'
>;
