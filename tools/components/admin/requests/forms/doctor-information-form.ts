import { Physician } from '@lib/graphql/types'; // GraphQL types

export type DoctorInformation = Pick<
  Physician,
  'name' | 'mspNumber' | 'phone' | 'addressLine1' | 'addressLine2' | 'city' | 'postalCode'
>;
