import { Physician as _Physician } from '@lib/graphql/types'; // Physician type

/** Physician in Doctor information forms */
export type Physician = Pick<
  _Physician,
  | 'name'
  | 'mspNumber'
  | 'phone'
  | 'addressLine1'
  | 'addressLine2'
  | 'city'
  | 'province'
  | 'postalCode'
>;
