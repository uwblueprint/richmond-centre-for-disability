import { ApplicationType, Gender } from '@prisma/client';
import { boolean, date, mixed, number, object, string } from 'yup';

/**
 * Validation schema for permit holder information forms when creating and viewing requests
 */
export const requestPermitHolderInformationSchema = object({
  type: mixed<ApplicationType>().oneOf(Object.values(ApplicationType)).required(),
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
  otherGender: string().optional(),
  email: string().email('Please enter a valid email address').nullable().default(null),
  phone: string()
    .required('Please enter a valid phone number')
    .max(12, 'Please enter a valid phone number in the format 000-000-0000'),
  receiveEmailUpdates: boolean().required(),
  addressLine1: string().required('Please enter an address'),
  addressLine2: string().nullable().default(null),
  city: string().required('Please enter a city'),
  postalCode: string()
    .required('Please enter a valid postal code')
    .min(6, 'Please enter a valid postal code')
    .max(7, 'Please enter a valid postal code'),
});

/**
 * Validation schema for edit permit holder information form
 */
export const editRequestPermitHolderInformationSchema = object({
  permitHolder: requestPermitHolderInformationSchema,
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
    .max(12, 'Please enter a valid phone number in the format 000-000-0000'),
  receiveEmailUpdates: boolean().required(),
  addressLine1: string().required('Please enter an address'),
  addressLine2: string().nullable().default(null),
  city: string().required('Please enter a city'),
  postalCode: string()
    .required('Please enter a valid postal code')
    .min(6, 'Please enter a valid postal code')
    .max(7, 'Please enter a valid postal code'),
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