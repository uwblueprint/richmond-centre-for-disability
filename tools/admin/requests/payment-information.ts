import { gql } from '@apollo/client';
import { Province } from '@lib/graphql/types';
import {
  Application,
  ApplicationProcessing,
  DonationTaxReceipt,
  GenerateDonationTaxReceiptResult,
  MutationGenerateDonationTaxReceiptArgs,
  MutationUpdateApplicationBillingInformationArgs,
  MutationUpdateApplicationPaymentInformationArgs,
  PaymentType,
  QueryApplicationArgs,
  UpdateApplicationPaymentInformationResult,
  UpdateApplicationBillingInformationResult,
} from '@lib/graphql/types'; // Applicant type

/** Payment information for forms */
export type PaymentInformationFormData = Pick<
  Application,
  | 'donationAmount'
  | 'secondDonationAmount'
  | 'processingFee'
  | 'secondProcessingFee'
  | 'hasSecondPaymentMethod'
  | 'shippingAddressSameAsHomeAddress'
  | 'shippingFullName'
  | 'shippingAddressLine1'
  | 'shippingAddressLine2'
  | 'shippingCity'
  | 'shippingCountry'
  | 'shippingPostalCode'
  | 'billingAddressSameAsHomeAddress'
  | 'billingFullName'
  | 'billingAddressLine1'
  | 'billingAddressLine2'
  | 'billingCity'
  | 'billingCountry'
  | 'billingPostalCode'
> & {
  paymentMethod: PaymentType | null;
  secondPaymentMethod: PaymentType | null;
  shippingProvince: Province | null;
  billingProvince: Province | null;
};

export type BillingInformationFormData = Pick<
  Application,
  | 'billingAddressSameAsHomeAddress'
  | 'billingFullName'
  | 'billingAddressLine1'
  | 'billingAddressLine2'
  | 'billingCity'
  | 'billingCountry'
  | 'billingPostalCode'
> & {
  billingProvince: Province | null;
};

/** Payment information for cards */
export type PaymentInformationCardData = Pick<
  Application,
  | 'paymentMethod'
  | 'processingFee'
  | 'donationAmount'
  | 'secondPaymentMethod'
  | 'secondProcessingFee'
  | 'secondDonationAmount'
  | 'hasSecondPaymentMethod'
  | 'paidThroughShopify'
  | 'shopifyPaymentStatus'
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
  | 'donationTaxReceiptEnabled'
> & {
  donationTaxReceipt: Pick<
    DonationTaxReceipt,
    'receiptNumber' | 's3ObjectKey' | 's3ObjectUrl' | 'createdAt' | 'updatedAt'
  > | null;
  processing: Pick<
    ApplicationProcessing,
    'appNumber' | 'reviewRequestCompleted' | 'paymentRefunded'
  >;
};

/** Get payment information of an application */
export const GET_PAYMENT_INFORMATION = gql`
  query GetPaymentInformation($id: Int!) {
    application(id: $id) {
      id
      paymentMethod
      processingFee
      donationAmount
      secondPaymentMethod
      secondProcessingFee
      secondDonationAmount
      hasSecondPaymentMethod
      paidThroughShopify
      shopifyPaymentStatus
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
      donationTaxReceiptEnabled
      donationTaxReceipt {
        receiptNumber
        s3ObjectKey
        s3ObjectUrl
        createdAt
        updatedAt
      }
      processing {
        appNumber
        reviewRequestCompleted
        paymentRefunded
      }
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
      error
    }
  }
`;

export type UpdatePaymentInformationRequest = MutationUpdateApplicationPaymentInformationArgs;

export type UpdatePaymentInformationResponse = {
  updateApplicationPaymentInformation: UpdateApplicationPaymentInformationResult;
};

export const UPDATE_BILLING_INFORMATION = gql`
  mutation UpdateApplicationBillingInformation($input: UpdateApplicationBillingInformationInput!) {
    updateApplicationBillingInformation(input: $input) {
      ok
      error
    }
  }
`;

export type UpdateBillingInformationRequest = MutationUpdateApplicationBillingInformationArgs;

export type UpdateBillingInformationResponse = {
  updateApplicationBillingInformation: UpdateApplicationBillingInformationResult;
};

export const GENERATE_DONATION_TAX_RECEIPT = gql`
  mutation GenerateDonationTaxReceipt($input: GenerateDonationTaxReceiptInput!) {
    generateDonationTaxReceipt(input: $input) {
      ok
      error
    }
  }
`;

export type GenerateDonationTaxReceiptRequest = MutationGenerateDonationTaxReceiptArgs;

export type GenerateDonationTaxReceiptResponse = {
  generateDonationTaxReceipt: GenerateDonationTaxReceiptResult;
};
