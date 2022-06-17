import { phoneNumberRegex, postalCodeRegex } from '@lib/utils/validation';
import { ApplicationType, Gender } from '@prisma/client';
import { boolean, date, mixed, number, object, string } from 'yup';

/**
 * Validation schema for permit holder information forms when creating and viewing requests
 */
export const requestPermitHolderInformationSchema = object({
  type: mixed<ApplicationType>().oneOf(Object.values(ApplicationType)).optional(),
  firstName: string().required('Please enter a first name'),
  middleName: string().nullable().default(null),
  lastName: string().required('Please enter a last name'),
  dateOfBirth: date().when('type', {
    is: 'NEW',
    then: date().required('Please enter your date of birth'),
    otherwise: date(),
  }),
  gender: mixed<Gender>()
    .oneOf(Object.values(Gender))
    .optional()
    .when('type', {
      is: 'NEW',
      then: mixed<Gender>().oneOf(Object.values(Gender)).required('Please select a gender'),
      otherwise: mixed<Gender>().oneOf(Object.values(Gender)).optional(),
    }),
  otherGender: string().when('type', {
    is: 'NEW',
    then: string().nullable().default(null),
    otherwise: string().optional(),
  }),
  email: string().email('Please enter a valid email address').nullable().default(null),
  phone: string()
    .required('Please enter a valid phone number')
    .matches(phoneNumberRegex, 'Please enter a valid phone number in the format 000-000-0000'),
  receiveEmailUpdates: boolean().when('type', {
    is: 'NEW' || 'RENEWAL',
    then: boolean().required(),
  }),
  addressLine1: string().required('Please enter an address'),
  addressLine2: string().nullable().default(null),
  city: string().required('Please enter a city'),
  postalCode: string()
    .required('Please enter a valid postal code in the format X0X 0X0')
    .matches(postalCodeRegex, 'Please enter a valid postal code in the format X0X 0X0'),
});

/**
 * Validation schema for edit permit holder information form
 */
export const editRequestPermitHolderInformationSchema = object({
  permitHolder: requestPermitHolderInformationSchema,
});

/**
 * Validation schema for request-side permit holder information mutation
 */
export const requestPermitHolderInformationMutationSchema =
  requestPermitHolderInformationSchema.shape({
    id: number().positive('Invalid application ID').required('Application ID missing'),
  });

/**
 * Validation schema for permit holder information forms when viewing a permit holder
 */
export const permitHolderInformationSchema = object({
  firstName: string().required('Please enter a first name'),
  middleName: string().nullable().default(null),
  lastName: string().required('Please enter a last name'),
  dateOfBirth: date().required('Please enter your date of birth'),
  gender: mixed<Gender>().oneOf(Object.values(Gender)).required('Please select a gender'),
  otherGender: string().nullable().default(null),
  email: string().email('Please enter a valid email address').nullable().default(null),
  phone: string()
    .required('Please enter a valid phone number')
    .matches(phoneNumberRegex, 'Please enter a valid phone number in the format 000-000-0000'),
  receiveEmailUpdates: boolean().required(),
  addressLine1: string().required('Please enter an address'),
  addressLine2: string().nullable().default(null),
  city: string().required('Please enter a city'),
  postalCode: string()
    .required('Please enter a valid postal code in the format X0X 0X0')
    .matches(postalCodeRegex, 'Please enter a valid postal code in the format X0X 0X0'),
});

/**
 * Verify identity validation schema
 */
export const verifyIdentitySchema = object({
  userId: number()
    .typeError('User ID must be a positive number')
    .required('Please enter your User ID')
    .positive('Please enter your User ID')
    .integer('Please enter your User ID'),
  phoneNumberSuffix: string()
    .matches(/^\d+$/, 'Must only contain numbers')
    .required('Please enter the last 4 digits of your phone number')
    .length(4, 'Must be exactly 4 digits'),
  dateOfBirth: date().required('Please enter your date of birth'),
});
