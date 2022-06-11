import { phoneNumberRegex, postalCodeRegex } from '@lib/utils/validation';
import { object, bool, string } from 'yup';
/**
 * Entire Guardian/POA validation schema
 */

export const guardianInformationSchema = object({
  omitGuardianPoa: bool().default(false),
  firstName: string()
    .nullable()
    .default(null)
    .when('omitGuardianPoa', {
      is: false,
      then: string().typeError('Please enter a first name').required('Please enter a first name'),
    }),
  middleName: string()
    .nullable()
    .default(null)
    .when('omitGuardianPoa', {
      is: false,
      then: string().nullable().default(null),
    }),
  lastName: string()
    .nullable()
    .default(null)
    .when('omitGuardianPoa', {
      is: false,
      then: string().typeError('Please enter a last name').required('Please enter a last name'),
    }),
  phone: string()
    .nullable()
    .default(null)
    .when('omitGuardianPoa', {
      is: false,
      then: string()
        .typeError('Please enter a phone number')
        .required('Please enter a phone number')
        .matches(phoneNumberRegex, 'Please enter a valid phone number in the format 000-000-0000'),
    }),
  relationship: string()
    .nullable()
    .default(null)
    .when('omitGuardianPoa', {
      is: false,
      then: string()
        .typeError('Please enter a relationship to applicant')
        .required('Please enter a relationship to applicant'),
    }),
  addressLine1: string()
    .nullable()
    .default(null)
    .when('omitGuardianPoa', {
      is: false,
      then: string().typeError('Please enter an address').required('Please enter an address'),
    }),
  addressLine2: string().nullable().default(null),
  city: string()
    .nullable()
    .default(null)
    .when('omitGuardianPoa', {
      is: false,
      then: string().typeError('Please enter a city').required('Please enter a city'),
    }),
  postalCode: string()
    .nullable()
    .default(null)
    .when('omitGuardianPoa', {
      is: false,
      then: string()
        .typeError('Please enter a postal code')
        .required('Please enter a postal code')
        .matches(postalCodeRegex, 'Please enter a valid postal code in the format X0X 0X0'),
    }),
});

/**
 * Validation schema for edit guardian information form
 */
export const editGuardianInformationSchema = object({
  guardianInformation: guardianInformationSchema,
});
