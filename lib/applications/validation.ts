import {
  permitHolderInformationSchema,
  requestPermitHolderInformationSchema,
} from '@lib/applicants/validation';
import { physicianAssessmentSchema } from '@lib/physicians/validation';
import { PaymentType, Province, ReasonForReplacement } from '@prisma/client';
import { bool, date, mixed, number, object, string } from 'yup';
import {
  AccessibleConvertedVanLoadingMethod,
  RequiresWiderParkingSpaceReason,
} from '@lib/graphql/types';

/**
 * Additional Questions form validation schema
 */
export const additionalQuestionsSchema = object({
  usesAccessibleConvertedVan: bool()
    .typeError('Please select an option')
    .required('Please select an option'),
  accessibleConvertedVanLoadingMethod: mixed<AccessibleConvertedVanLoadingMethod>()
    .nullable()
    .default(null)
    .when('usesAccessibleConvertedVan', {
      is: true,
      then: mixed<AccessibleConvertedVanLoadingMethod>()
        .oneOf(Object.values(['SIDE_LOADING', 'END_LOADING']))
        .required('Please select an option'),
      otherwise: mixed<AccessibleConvertedVanLoadingMethod>().nullable().default(null),
    }),
  requiresWiderParkingSpace: bool()
    .typeError('Please select an option')
    .required('Please select an option'),
  requiresWiderParkingSpaceReason: mixed<RequiresWiderParkingSpaceReason>()
    .nullable()
    .default(null)
    .when('requiresWiderParkingSpace', {
      is: true,
      then: mixed<RequiresWiderParkingSpaceReason>()
        .oneOf(Object.values(['HAS_ACCESSIBLE_VAN', 'MEDICAL_REASONS', 'OTHER']))
        .required('Please select an option'),
    }),
  otherRequiresWiderParkingSpaceReason: string()
    .nullable()
    .default(null)
    .when('requiresWiderParkingSpaceReason', {
      is: 'OTHER',
      then: string().typeError('Please enter a description').required('Please enter a description'),
    }),
});

/**
 * Payment information form validation schema
 */
export const paymentInformationSchema = object({
  paymentMethod: mixed<PaymentType>()
    .oneOf(Object.values(PaymentType))
    .required('Please select a payment method'),
  donationAmount: string()
    .matches(/^([0-9]+\.?[0-9]{0,2}|\.[0-9]{1,2}|)$/, 'Please enter a valid amount')
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
    .nullable()
    .default(null)
    .when('billingAddressSameAsHomeAddress', {
      is: false,
      then: mixed<Province>()
        .oneOf(Object.values(Province))
        .required('Please select a province/territory'),
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
 * Reason for replacement form validation schema
 */
export const reasonForReplacementFormSchema = object({
  reason: mixed<ReasonForReplacement>()
    .oneOf(Object.values(ReasonForReplacement))
    .required('Please select reason for replacement'),
  lostTimestamp: date()
    .nullable()
    .default(null)
    .when('reason', {
      is: 'LOST',
      then: date()
        .transform((_value, originalValue) => {
          return new Date(originalValue);
        })
        .typeError('Please enter date APP was lost')
        .max(new Date(), 'Date must be in the past')
        .required('Please enter date APP was lost'),
    }),
  lostLocation: string()
    .nullable()
    .default(null)
    .when('reason', {
      is: 'LOST',
      then: string()
        .typeError('Please enter location APP was lost')
        .required('Please enter location APP was lost'),
    }),
  eventDescription: string()
    .nullable()
    .default(null)
    .when('reason', {
      is: (reason: ReasonForReplacement) => reason === 'LOST' || reason === 'OTHER',
      then: string()
        .typeError('Please enter event description')
        .required('Please enter event description'),
    }),
  stolenPoliceFileNumber: number()
    .nullable()
    .default(null)
    .when('reason', {
      is: 'STOLEN',
      then: number()
        .typeError('Please enter police file number')
        .required('Please enter police file number'),
    }),
  stolenJurisdiction: string().nullable().default(null).when('reason', {
    is: 'STOLEN',
    then: string().nullable(),
  }),
  stolenPoliceOfficerName: string().nullable().default(null).when('reason', {
    is: 'STOLEN',
    then: string().nullable(),
  }),
});

/**
 * Validation schema for edit reason for replacement form
 */
export const editReasonForReplacementFormSchema = object({
  reasonForReplacement: reasonForReplacementFormSchema,
});

/**
 * Create new request form validation schema
 */
export const createNewRequestFormSchema = object({
  permitHolder: permitHolderInformationSchema,
  physicianAssessment: physicianAssessmentSchema,
  additionalInformation: additionalQuestionsSchema,
  paymentInformation: paymentInformationSchema,
});

/**
 * Create renewal request form validation schema
 */
export const renewalRequestFormSchema = object({
  permitHolder: requestPermitHolderInformationSchema,
  additionalInformation: additionalQuestionsSchema,
  paymentInformation: paymentInformationSchema,
});

/**
 * Create replacement request form validation schema
 */
export const replacementFormSchema = object({
  permitHolder: requestPermitHolderInformationSchema,
  paymentInformation: paymentInformationSchema,
  reasonForReplacement: reasonForReplacementFormSchema,
});
