import { Applicant } from '@lib/graphql/types';

export type PermitHolderInformationData = Pick<
  Applicant,
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'phone'
  | 'addressLine1'
  | 'addressLine2'
  | 'city'
  | 'postalCode'
>;
