import {
  permitHolderInformationSchema,
  requestPermitHolderInformationSchema,
} from '@lib/applicants/validation';
import { physicianAssessmentSchema } from '@lib/physicians/validation';
import { PaymentType, Province } from '@prisma/client';
import { bool, mixed, object, string } from 'yup';

/**
 * Payment information form validation schema
 */
export const paymentInformationSchema = object({
  paymentMethod: mixed<PaymentType>()
    .oneOf(Object.values(PaymentType))
    .required('Please select a payment method'),
  donationAmount: string()
    .matches(/^[0-9]*$/, 'Please enter a valid amount')
    .nullable()
    .default(null),
  shippingAddressSameAsHomeAddress: bool().default(false),
  shippingFullName: string()
    .nullable()
    .default(null)
    .when('shippingAddressSameAsHomeAddress', {
      is: false,
      then: string()
        .typeError('Please enter the recipient’s full name')
        .required('Please enter the recipient’s full name'),
    }),
  shippingAddressLine1: string()
    .nullable()
    .default(null)
    .when('shippingAddressSameAsHomeAddress', {
      is: false,
      then: string().typeError('Please enter an address').required('Please enter an address'),
    }),
  shippingAddressLine2: string().nullable().default(null),
  shippingCity: string()
    .nullable()
    .default(null)
    .when('shippingAddressSameAsHomeAddress', {
      is: false,
      then: string().typeError('Please enter a city name').required('Please enter a city name'),
    }),
  shippingProvince: mixed<Province>()
    .oneOf(Object.values(Province))
    .nullable()
    .default(null)
    .when('shippingAddressSameAsHomeAddress', {
      is: false,
      then: mixed<Province>()
        .oneOf(Object.values(Province))
        .required('Please select a province/territory'),
    }),
  shippingCountry: string()
    .nullable()
    .default(null)
    .when('shippingAddressSameAsHomeAddress', {
      is: false,
      then: string()
        .typeError('Please enter a country/region')
        .required('Please enter a country/region'),
    }),
  shippingPostalCode: string()
    .nullable()
    .default(null)
    .when('shippingAddressSameAsHomeAddress', {
      is: false,
      then: string().typeError('Please enter a postal code').required('Please enter a postal code'),
    }),
  billingAddressSameAsHomeAddress: bool().default(false),
  billingFullName: string()
    .nullable()
    .default(null)
    .when('billingAddressSameAsHomeAddress', {
      is: false,
      then: string()
        .typeError('Please enter the recipient’s full name')
        .required('Please enter the recipient’s full name'),
    }),
  billingAddressLine1: string()
    .nullable()
    .default(null)
    .when('billingAddressSameAsHomeAddress', {
      is: false,
      then: string().typeError('Please enter an address').required('Please enter an address'),
    }),
  billingAddressLine2: string().nullable().default(null),
  billingCity: string()
    .nullable()
    .default(null)
    .when('billingAddressSameAsHomeAddress', {
      is: false,
      then: string().typeError('Please enter a city name').required('Please enter a city name'),
    }),
  billingProvince: mixed<Province>()
    .oneOf(Object.values(Province))
    .nullable()
    .default(null)
    .when('billingAddressSameAsHomeAddress', {
      is: false,
      then: mixed<Province>()
        .oneOf(Object.values(Province))
        .required('Please select a province/territory.'),
    }),
  billingCountry: string()
    .nullable()
    .default(null)
    .when('billingAddressSameAsHomeAddress', {
      is: false,
      then: string()
        .typeError('Please select a country/region')
        .required('Please select a country/region'),
    }),
  billingPostalCode: string()
    .nullable()
    .default(null)
    .when('billingAddressSameAsHomeAddress', {
      is: false,
      then: string().typeError('Please enter a postal code').required('Please enter a postal code'),
    }),
});

/**
 * Validation schema for edit payment information form
 */
export const editPaymentInformationSchema = object({
  paymentInformation: paymentInformationSchema,
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
