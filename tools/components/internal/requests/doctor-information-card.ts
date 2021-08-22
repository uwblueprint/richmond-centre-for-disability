import { Physician } from '@lib/graphql/types'; // Physician type

export type DoctorInformationCardPhysician = Pick<
  Physician,
  | 'name'
  | 'mspNumber'
  | 'phone'
  | 'addressLine1'
  | 'addressLine2'
  | 'city'
  | 'province'
  | 'postalCode'
>;
