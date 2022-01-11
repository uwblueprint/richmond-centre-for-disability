import { Application } from '@lib/graphql/types';

/** Permit holder information for forms */
export type PermitHolderInformation = Pick<
  Application,
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'phone'
  | 'addressLine1'
  | 'addressLine2'
  | 'city'
  | 'postalCode'
  | 'receiveEmailUpdates'
>;
