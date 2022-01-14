import { gql } from '@apollo/client';
import {
  Application,
  MutationUpdateApplicationPaymentInformationArgs,
  QueryApplicationArgs,
  UpdateApplicationPaymentInformationResult,
} from '@lib/graphql/types'; // Applicant type

/** Payment information for forms */
export type PaymentInformationFormData = Pick<
  Application,
  | 'paymentMethod'
  | 'processingFee'
  | 'donationAmount'
  | 'shippingAddressSameAsHomeAddress'
  | 'shippingFullName'
  | 'shippingAddressLine1'
  | 'shippingAddressLine2'
  | 'shippingCity'
  | 'shippingProvince'
  | 'shippingCountry'
  | 'shippingPostalCode'
  | 'billingAddressSameAsHomeAddress'
  | 'billingFullName'
  | 'billingAddressLine1'
  | 'billingAddressLine2'
  | 'billingCity'
  | 'billingProvince'
  | 'billingCountry'
  | 'billingPostalCode'
>;

/** Payment information for cards */
export type PaymentInformationCardData = Pick<
  Application,
  | 'paymentMethod'
  | 'processingFee'
  | 'donationAmount'
  | 'shippingAddressSameAsHomeAddress'
  | 'shippingFullName'
  | 'shippingAddressLine1'
  | 'shippingAddressLine2'
  | 'shippingCity'
  | 'shippingProvince'
  | 'shippingCountry'
  | 'shippingPostalCode'
  | 'billingAddressSameAsHomeAddress'
  | 'billingFullName'
  | 'billingAddressLine1'
  | 'billingAddressLine2'
  | 'billingCity'
  | 'billingProvince'
  | 'billingCountry'
  | 'billingPostalCode'
>;

/** Get payment information of an application */
export const GET_PAYMENT_INFORMATION = gql`
  query GetPaymentInformation($id: Int!) {
    application(id: $id) {
      id
      paymentMethod
      processingFee
      donationAmount
      shippingAddressSameAsHomeAddress
      shippingFullName
      shippingAddressLine1
      shippingAddressLine2
      shippingCity
      shippingProvince
      shippingCountry
      shippingPostalCode
      billingAddressSameAsHomeAddress
      billingFullName
      billingAddressLine1
      billingAddressLine2
      billingCity
      billingProvince
      billingCountry
      billingPostalCode
    }
  }
`;

export type GetPaymentInformationRequest = QueryApplicationArgs;

export type GetPaymentInformationResponse = {
  application: PaymentInformationCardData;
};

/** Update payment information of application */
export const UPDATE_PAYMENT_INFORMATION = gql`
  mutation UpdateApplicationPaymentInformation($input: UpdateApplicationPaymentInformationInput!) {
    updateApplicationPaymentInformation(input: $input) {
      ok
    }
  }
`;

export type UpdatePaymentInformationRequest = MutationUpdateApplicationPaymentInformationArgs;

export type UpdatePaymentInformationResponse = {
  updateApplicationPaymentInformation: UpdateApplicationPaymentInformationResult;
};
