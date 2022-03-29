import {
  permitHolderInformationSchema,
  requestPermitHolderInformationSchema,
} from '@lib/applicants/validation';
import { physicianAssessmentSchema } from '@lib/physicians/validation';
import { PaymentType } from '@prisma/client';
import { bool, mixed, object, string } from 'yup';

/**
 * Payment information form validation schema
 */
export const paymentInformationSchema = object({
  paymentMethod: mixed<PaymentType>()
    .oneOf(Object.values(PaymentType))
    .required('Please select a payment method'),
  donationAmount: string().matches(/^\d+$/, 'Please enter a valid amount').nullable(),
  shippingAddressSameAsHomeAddress: bool().nullable(),
  shippingFullName: string().when('shippingAddressSameAsHomeAddress', {
    is: false,
    then: string().required('Please enter the recipient’s full name.'),
  }),
  shippingAddressLine1: string().when('shippingAddressSameAsHomeAddress', {
    is: false,
    then: string().required('Please enter an address.'),
  }),
  shippingAddressLine2: string().nullable(),
  shippingCity: string().when('shippingAddressSameAsHomeAddress', {
    is: false,
    then: string().required('Please enter a city name.'),
  }),
  shippingProvince: string().when('shippingAddressSameAsHomeAddress', {
    is: false,
    then: string().required('Please select a province/territory.'),
  }),
  shippingCountry: string().when('shippingAddressSameAsHomeAddress', {
    is: false,
    then: string().required('Please select a country/region.'),
  }),
  shippingPostalCode: string().when('shippingAddressSameAsHomeAddress', {
    is: false,
    then: string().required('Please enter a postal code.'),
  }),

  billingAddressSameAsHomeAddress: string().nullable(),
  billingFullName: string().when('billingAddressSameAsHomeAddress', {
    is: false,
    then: string().required('Please enter the recipient’s full name.'),
  }),
  billingAddressLine1: string().when('billingAddressSameAsHomeAddress', {
    is: false,
    then: string().required('Please enter an address.'),
  }),
  billingAddressLine2: string().nullable(),
  billingCity: string().when('billingAddressSameAsHomeAddress', {
    is: false,
    then: string().required('Please enter a city name.'),
  }),
  billingProvince: string().when('billingAddressSameAsHomeAddress', {
    is: false,
    then: string().required('Please select a province/territory.'),
  }),
  billingCountry: string().when('billingAddressSameAsHomeAddress', {
    is: false,
    then: string().required('Please select a country/region.'),
  }),
  billingPostalCode: string().when('billingAddressSameAsHomeAddress', {
    is: false,
    then: string().required('Please enter a postal code.'),
  }),
});

/**
 * Create new request form validation schema
 */
export const createNewRequestFormSchema = object({
  permitHolder: permitHolderInformationSchema,
  physicianAssessment: physicianAssessmentSchema,
  paymentInformation: paymentInformationSchema,
});

/**
 * Create renewal request form validation schema
 */
export const renewalRequestFormSchema = object({
  permitHolder: requestPermitHolderInformationSchema,
  paymentInformation: paymentInformationSchema,
});

/**
 * Create replacement request form validation schema
 */
export const replacementFormSchema = object({
  permitHolder: requestPermitHolderInformationSchema,
  paymentInformation: paymentInformationSchema,
});
