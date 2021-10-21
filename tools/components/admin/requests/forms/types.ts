import { Application } from '@lib/graphql/types';

export type PermitHolderInformationData = Pick<
  Application,
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'phone'
  | 'addressLine1'
  | 'addressLine2'
  | 'city'
  | 'postalCode'
>;
