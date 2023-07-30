import {
  permitHolderInformationSchema,
  requestPermitHolderInformationSchema,
} from '@lib/applicants/validation';
import { guardianInformationSchema } from '@lib/guardian/validation';
import {
  physicianAssessmentSchema,
  requestPhysicianInformationSchema,
} from '@lib/physicians/validation';
import { PaymentType, Province, ReasonForReplacement, ShopifyPaymentStatus } from '@prisma/client';
import { bool, date, mixed, number, object, string } from 'yup';
import {
  AccessibleConvertedVanLoadingMethod,
  RequiresWiderParkingSpaceReason,
} from '@lib/graphql/types';
import { monetaryValueRegex, phoneNumberRegex, postalCodeRegex } from '@lib/utils/validation';

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
 * Validation schema for edit additional questions form
 */
export const editAdditionalQuestionsSchema = object({
  additionalInformation: additionalQuestionsSchema,
});

/**
 * Validation schema for additional information mutation
 */
export const additionalQuestionsMutationSchema = additionalQuestionsSchema.shape({
  id: number().positive('Invalid application ID').required('Application ID missing'),
});

/**
 * Payment information form validation schema
 */
export const paymentInformationSchema = object({
  paymentMethod: mixed<PaymentType>()
    .oneOf(Object.values(PaymentType))
    .required('Please select a payment method'),
  donationAmount: string()
    .matches(monetaryValueRegex, 'Please enter a valid amount')
    .nullable()
    .default(null),
  processingFee: string()
    .matches(monetaryValueRegex, 'Please enter a valid amount')
    .required('Please enter a permit fee'),
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
      then: string()
        .typeError('Please enter a postal code')
        .required('Please enter a postal code')
        .matches(postalCodeRegex, 'Please enter a valid postal code in the format X0X 0X0'),
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
      then: string()
        .typeError('Please enter a postal code')
        .required('Please enter a postal code')
        .matches(postalCodeRegex, 'Please enter a valid postal code in the format X0X 0X0'),
    }),
});

/**
 * Validation schema for edit payment information form
 */
export const editPaymentInformationSchema = object({
  paymentInformation: paymentInformationSchema,
});

/**
 * Validation schema for payment information mutation
 */
export const paymentInformationMutationSchema = paymentInformationSchema.shape({
  id: number().positive('Invalid application ID').required('Application ID missing'),
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
      otherwise: date()
        .transform(_ => null)
        .nullable(),
    }),
  lostLocation: string()
    .nullable()
    .default(null)
    .when('reason', {
      is: 'LOST',
      then: string()
        .typeError('Please enter location APP was lost')
        .required('Please enter location APP was lost'),
      otherwise: string()
        .transform(_ => null)
        .nullable(),
    }),
  eventDescription: string()
    .nullable()
    .default(null)
    .when('reason', {
      is: (reason: ReasonForReplacement) => reason === 'LOST' || reason === 'OTHER',
      then: string()
        .typeError('Please enter event description')
        .required('Please enter event description'),
      otherwise: string()
        .transform(_ => null)
        .nullable(),
    }),
  stolenPoliceFileNumber: number()
    .nullable()
    .default(null)
    .when('reason', {
      is: 'STOLEN',
      then: number()
        .typeError('Please enter police file number')
        .required('Please enter police file number'),
      otherwise: number()
        .transform(_ => null)
        .nullable(),
    }),
  stolenJurisdiction: string()
    .nullable()
    .default(null)
    .when('reason', {
      is: 'STOLEN',
      then: string().nullable(),
      otherwise: string()
        .transform(_ => null)
        .nullable(),
    }),
  stolenPoliceOfficerName: string()
    .nullable()
    .default(null)
    .when('reason', {
      is: 'STOLEN',
      then: string().nullable(),
      otherwise: string()
        .transform(_ => null)
        .nullable(),
    }),
});

/**
 * Validation schema for edit reason for replacement form
 */
export const editReasonForReplacementFormSchema = object({
  reasonForReplacement: reasonForReplacementFormSchema,
});

/**
 * Validation schema for reason for replacement mutation
 */
export const reasonForReplacementMutationSchema = reasonForReplacementFormSchema.shape({
  id: number().positive('Invalid application ID').required('Application ID missing'),
});

/**
 * Create new request form validation schema
 */
export const createNewRequestFormSchema = object({
  permitHolder: permitHolderInformationSchema,
  physicianAssessment: physicianAssessmentSchema,
  guardianInformation: guardianInformationSchema,
  doctorInformation: requestPhysicianInformationSchema,
  additionalInformation: additionalQuestionsSchema,
  paymentInformation: paymentInformationSchema,
});

/**
 * Create renewal request form validation schema
 */
export const renewalRequestFormSchema = object({
  permitHolder: requestPermitHolderInformationSchema,
  doctorInformation: requestPhysicianInformationSchema,
  additionalInformation: additionalQuestionsSchema,
  paymentInformation: paymentInformationSchema,
});

/**
 * Create renewal request mutation validation schema
 */
export const renewalRequestMutationSchema = renewalRequestFormSchema.shape({
  applicantId: number().positive('Invalid application ID').required('Application ID missing'),
  paidThroughShopify: bool().required(),
  shopifyPaymentStatus: mixed<ShopifyPaymentStatus>()
    .oneOf([...Object.values(ShopifyPaymentStatus), null])
    .nullable()
    .default(null),
  shopifyConfirmationNumber: string().nullable().default(null),
  shopifyOrderNumber: string().nullable().default(null),
});

/**
 * Create replacement request form validation schema
 */
export const replacementFormSchema = object({
  permitHolder: requestPermitHolderInformationSchema,
  paymentInformation: paymentInformationSchema,
  reasonForReplacement: reasonForReplacementFormSchema,
});

/**
 * Applicant facing renewal request personal address form validation schema
 */
export const applicantFacingRenewalPersonalAddressSchema = object({
  updatedAddress: bool().required(),
  personalAddressLine1: string()
    .nullable()
    .default(null)
    .when('updatedAddress', {
      is: true,
      then: string().typeError('Please enter an address').required('Please enter an address'),
    }),
  personalAddressLine2: string().nullable().default(null),
  personalCity: string()
    .nullable()
    .default(null)
    .when('updatedAddress', {
      is: true,
      then: string().typeError('Please enter a city').required('Please enter a city'),
    }),
  personalPostalCode: string()
    .nullable()
    .default(null)
    .when('updatedAddress', {
      is: true,
      then: string()
        .typeError('Please enter a postal code')
        .required('Please enter a postal code')
        .matches(postalCodeRegex, 'Please enter a valid postal code in the format X0X 0X0'),
    }),
});

/**
 * Applicant facing renewal request contact information form validation schema
 */
export const applicantFacingRenewalContactSchema = object().shape(
  {
    updatedContactInfo: bool().required(),
    contactPhoneNumber: string()
      .nullable()
      .default(null)
      .when(['updatedContactInfo', 'contactEmailAddress'], {
        is: (updatedContactInfo: boolean, contactEmailAddress: string) => {
          return updatedContactInfo && !contactEmailAddress;
        },
        then: string()
          .typeError('Please enter a valid phone number')
          .required('Please enter a valid phone number')
          .matches(
            phoneNumberRegex,
            'Please enter a valid phone number in the format 555-555-5555'
          ),
      }),
    contactEmailAddress: string()
      .email('Please enter a valid email address')
      .nullable()
      .default(null)
      .when(['updatedContactInfo', 'contactPhoneNumber'], {
        is: (updatedContactInfo: boolean, contactPhoneNumber: string) => {
          return updatedContactInfo && !contactPhoneNumber;
        },
        then: string()
          .typeError('Please enter a valid email address')
          .email('Please enter a valid email address')
          .required('Please enter a valid email address'),
      }),
    receiveEmailUpdates: bool().when('updatedContactInfo', {
      is: true,
      then: bool().required(),
    }),
  },
  [
    ['updatedContactInfo', 'contactEmailAddress'],
    ['updatedContactInfo', 'contactPhoneNumber'],
    ['contactEmailAddress', 'contactPhoneNumber'],
  ]
);

/**
 * Applicant facing renewal request doctor information form validation schema
 */
export const applicantFacingRenewalDoctorSchema = object().shape({
  updatedDoctor: bool().required(),
  doctorFirstName: string()
    .nullable()
    .default(null)
    .when('updatedDoctor', {
      is: true,
      then: string().typeError('Please enter a first name').required('Please enter a first name'),
    }),
  doctorLastName: string()
    .nullable()
    .default(null)
    .when('updatedDoctor', {
      is: true,
      then: string().typeError('Please enter a last name').required('Please enter a last name'),
    }),
  doctorMspNumber: string()
    .nullable()
    .default(null)
    .when('updatedDoctor', {
      is: true,
      then: string()
        .typeError('Please enter the MSP number')
        .required('Please enter the MSP number'),
    }),
  doctorAddressLine1: string()
    .nullable()
    .default(null)
    .when('updatedDoctor', {
      is: true,
      then: string().typeError('Please enter an address').required('Please enter an address'),
    }),
  doctorAddressLine2: string().nullable().default(null),
  doctorCity: string()
    .nullable()
    .default(null)
    .when('updatedDoctor', {
      is: true,
      then: string().typeError('Please enter a city name').required('Please enter a city name'),
    }),
  doctorPostalCode: string()
    .nullable()
    .default(null)
    .when('updatedDoctor', {
      is: true,
      then: string()
        .typeError('Please enter a postal code')
        .required('Please enter a postal code')
        .matches(postalCodeRegex, 'Please enter a valid postal code in the format X0X 0X0'),
    }),
  doctorPhoneNumber: string()
    .nullable()
    .default(null)
    .when('updatedDoctor', {
      is: true,
      then: string()
        .typeError('Please enter a valid phone number')
        .required('Please enter a valid phone number')
        .matches(phoneNumberRegex, 'Please enter a valid phone number in the format 555-555-5555'),
    }),
});

/**
 * Applicant facing renewal request mutation validation schema
 */
export const applicantFacingRenewalMutationSchema = applicantFacingRenewalPersonalAddressSchema
  .shape({
    applicantId: number().positive('Invalid application ID').required('Application ID missing'),
  })
  .concat(applicantFacingRenewalContactSchema)
  .concat(applicantFacingRenewalDoctorSchema);

/**
 * Applicant-facing renewal donation amount schema
 */
export const applicantFacingRenewalDonationSchema = object({
  donationAmount: mixed<number>()
    .oneOf([0, 5, 10, 25, 50, 75, 100])
    .required('Please select a donation amount')
    .transform((_value, originalValue) => {
      return Number(originalValue);
    }),
});
