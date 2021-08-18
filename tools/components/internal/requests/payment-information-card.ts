import { PaymentType } from '@lib/graphql/types'; // Applicant type

export interface PaymentInformation {
  processingFee: number;
  donationAmount: number;
  paymentMethod: PaymentType;
  shippingFullName: string;
  shippingAddressLine1: string;
  shippingAddressLine2: string;
  shippingCity: string;
  shippingProvince: string;
  shippingCountry: string;
  shippingPostalCode: string;
  billingFullName: string;
  billingAddressLine1: string;
  billingAddressLine2: string;
  billingCity: string;
  billingProvince: string;
  billingCountry: string;
  billingPostalCode: string;
  billingAddressSameAsShippingAddress: boolean;
}
