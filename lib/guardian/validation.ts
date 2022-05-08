import { object, bool, string } from 'yup';
/**
 * Entire Guardian/POA validation schema
 */

export const guardianInformationSchema = object({
  omitGuardianPoa: bool().default(false),
  guardianFirstName: string()
    .nullable()
    .default(null)
    .when('omitGuardianPoa', {
      is: false,
      then: string()
        .typeError('Please enter a first name')
        .matches(/^[a-zA-Z]*$/, 'Must only contain letters')
        .required('Please enter a first name'),
    }),
  guardianMiddleName: string()
    .nullable()
    .default(null)
    .when('omitGuardianPoa', {
      is: false,
      then: string()
        .nullable()
        .default(null)
        .matches(/^[a-zA-Z]*$/, 'Must only contain letters'),
    }),
  guardianLastName: string()
    .nullable()
    .default(null)
    .when('omitGuardianPoa', {
      is: false,
      then: string()
        .typeError('Please enter a last name')
        .matches(/^[a-zA-Z]*$/, 'Must only contain letters')
        .required('Please enter a last name'),
    }),
  guardianPhone: string()
    .nullable()
    .default(null)
    .when('omitGuardianPoa', {
      is: false,
      then: string()
        .min(10, 'Must be a valid phone number')
        .typeError('Please enter a phone number')
        .required('Please enter a phone number'),
    }),
  guardianRelationship: string()
    .nullable()
    .default(null)
    .when('omitGuardianPoa', {
      is: false,
      then: string()
        .typeError('Please enter a relationship to applicant')
        .required('Please enter a relationship to applicant'),
    }),
  guardianAddressLine1: string()
    .nullable()
    .default(null)
    .when('omitGuardianPoa', {
      is: false,
      then: string().typeError('Please enter an address').required('Please enter an address'),
    }),
  guardianAddressLine2: string().nullable().default(null),
  guardianCity: string()
    .nullable()
    .default(null)
    .when('omitGuardianPoa', {
      is: false,
      then: string()
        .typeError('Please enter a city')
        .matches(/^[a-zA-Z]*$/, 'Must only contain letters')
        .required('Please enter a city'),
    }),
  guardianPostalCode: string()
    .nullable()
    .default(null)
    .when('omitGuardianPoa', {
      is: false,
      then: string()
        .typeError('Please enter a postal code')
        .min(6, 'Must be a valid postal code')
        .max(7, 'Must be a valid postal code')
        .required('Please enter a postal code'),
    }),
});
