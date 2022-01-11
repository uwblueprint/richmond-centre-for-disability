import { Application } from '@lib/graphql/types'; // Applicant type

/** Payment information for forms */
export type PaymentInformation = Pick<
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
