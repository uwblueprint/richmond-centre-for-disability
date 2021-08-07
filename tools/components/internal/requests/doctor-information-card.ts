import { Physician } from '@lib/graphql/types'; // Physician type

export type DoctorInformationCardPhysician = Pick<
  Physician,
  | 'firstName'
  | 'mspNumber'
  | 'phone'
  | 'addressLine1'
  | 'addressLine2'
  | 'city'
  | 'province'
  | 'postalCode'
>;
