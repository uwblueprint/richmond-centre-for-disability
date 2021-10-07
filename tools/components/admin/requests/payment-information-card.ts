import { Application } from '@lib/graphql/types'; // Applicant type

export type PaymentInformation = Pick<
  Application,
  | 'processingFee'
  | 'donationAmount'
  | 'paymentMethod'
  | 'shippingFullName'
  | 'shippingAddressLine1'
  | 'shippingAddressLine2'
  | 'shippingCity'
  | 'shippingProvince'
  | 'shippingPostalCode'
  | 'billingFullName'
  | 'billingAddressLine1'
  | 'billingAddressLine2'
  | 'billingCity'
  | 'billingProvince'
  | 'billingPostalCode'
  | 'shippingAddressSameAsHomeAddress'
  | 'billingAddressSameAsHomeAddress'
>;
