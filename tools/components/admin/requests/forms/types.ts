import { Application, Renewal } from '@lib/graphql/types'; // GraphQL Types

// Permit Holder Information Object
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
>;

// Additional Questions Object
export type AdditionalQuestions = Pick<
  Renewal,
  'usesAccessibleConvertedVan' | 'requiresWiderParkingSpace'
>;

// Payment Details Object
export type PaymentDetails = Pick<
  Application,
  | 'paymentMethod'
  | 'donationAmount'
  | 'shippingAddressSameAsHomeAddress'
  | 'shippingFullName'
  | 'shippingAddressLine1'
  | 'shippingAddressLine2'
  | 'shippingCity'
  | 'shippingProvince'
  | 'shippingPostalCode'
  | 'billingAddressSameAsHomeAddress'
  | 'billingFullName'
  | 'billingAddressLine1'
  | 'billingAddressLine2'
  | 'billingCity'
  | 'billingProvince'
  | 'billingPostalCode'
>;