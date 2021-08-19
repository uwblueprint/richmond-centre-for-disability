import { Application } from '@lib/graphql/types'; // Applicant type

export type PersonalInformationCardApplicant = Pick<
  Application,
  | 'processingFee'
  | 'donationAmount'
  | 'paymentMethod'
  | 'shippingFullName'
  | 'shippingAddressLine1'
  | 'shippingAddressLine2'
  | 'shippingCity'
  | 'shippingProvince'
  | 'shippingCountry'
  | 'shippingPostalCode'
  | 'billingFullName'
  | 'billingAddressLine1'
  | 'billingAddressLine2'
  | 'billingCity'
  | 'billingProvince'
  | 'billingCountry'
  | 'billingPostalCode'
  | 'shippingAddressSameAsHomeAddress'
  | 'billingAddressSameAsHomeAddress'
>;
