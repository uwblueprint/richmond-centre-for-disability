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
  paymentInformation: object({
    paymentMethod: mixed<PaymentType>()
      .oneOf(Object.values(PaymentType))
      .required('Please select a payment method'),
    donationAmount: string()
      .matches(/^[0-9]*$/, 'Please enter a valid amount')
      .nullable()
      .default(null),
    shippingAddressSameAsHomeAddress: bool().default(false),
    shippingFullName: string()
      .default(null)
      .when('shippingAddressSameAsHomeAddress', {
        is: false,
        then: string().required('Please enter the recipient’s full name.'),
      }),
    shippingAddressLine1: string()
      .default(null)
      .when('shippingAddressSameAsHomeAddress', {
        is: false,
        then: string().required('Please enter an address.'),
      }),
    shippingAddressLine2: string().nullable().default(null),
    shippingCity: string()
      .default(null)
      .when('shippingAddressSameAsHomeAddress', {
        is: false,
        then: string().required('Please enter a city name.'),
      }),
    shippingProvince: mixed<Province>()
      .oneOf(Object.values(Province))
      .default(null)
      .when('shippingAddressSameAsHomeAddress', {
        is: false,
        then: mixed<Province>()
          .oneOf(Object.values(Province))
          .required('Please select a province/territory.'),
      }),
    shippingCountry: string()
      .default(null)
      .when('shippingAddressSameAsHomeAddress', {
        is: false,
        then: string().required('Please select a country/region.'),
      }),
    shippingPostalCode: string()
      .default(null)
      .when('shippingAddressSameAsHomeAddress', {
        is: false,
        then: string().required('Please enter a postal code.'),
      }),
    billingAddressSameAsHomeAddress: bool().default(false),
    billingFullName: string()
      .default(null)
      .when('billingAddressSameAsHomeAddress', {
        is: false,
        then: string().required('Please enter the recipient’s full name.'),
      }),
    billingAddressLine1: string()
      .default(null)
      .when('billingAddressSameAsHomeAddress', {
        is: false,
        then: string().required('Please enter an address.'),
      }),
    billingAddressLine2: string().nullable().default(null),
    billingCity: string()
      .default(null)
      .when('billingAddressSameAsHomeAddress', {
        is: false,
        then: string().required('Please enter a city name.'),
      }),
    billingProvince: mixed<Province>()
      .oneOf(Object.values(Province))
      .default(null)
      .when('billingAddressSameAsHomeAddress', {
        is: false,
        then: mixed<Province>()
          .oneOf(Object.values(Province))
          .required('Please select a province/territory.'),
      }),
    billingCountry: string()
      .default(null)
      .when('billingAddressSameAsHomeAddress', {
        is: false,
        then: string().required('Please select a country/region.'),
      }),
    billingPostalCode: string()
      .default(null)
      .when('billingAddressSameAsHomeAddress', {
        is: false,
        then: string().required('Please enter a postal code.'),
      }),
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
