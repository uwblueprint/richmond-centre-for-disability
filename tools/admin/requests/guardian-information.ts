import { Application } from '@lib/graphql/types';

/** Guardian information in forms */
export type GuardianInformation = Pick<
  Application,
  | 'firstName'
  | 'middleName'
  | 'lastName'
  | 'guardianRelationship'
  | 'phone'
  | 'addressLine1'
  | 'addressLine2'
  | 'city'
  | 'postalCode'
  | 'poaFormUrl'
>;
