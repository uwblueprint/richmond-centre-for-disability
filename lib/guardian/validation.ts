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
      then: string()
        .matches(/^[a-zA-Z]*$/, 'Must only contain letters')
        .required('Please enter a first name'),
    }),
  middleName: string()
    .nullable()
    .default(null)
    .when('omitGuardianPoa', {
      is: false,
      then: string().matches(/^[a-zA-Z]*$/, 'Must only contain letters'),
    }),
  lastName: string()
    .nullable()
    .default(null)
    .when('omitGuardianPoa', {
      is: false,
      then: string()
        .matches(/^[a-zA-Z]*$/, 'Must only contain letters')
        .required('Please enter a last name'),
    }),
  phoneNumber: string()
    .nullable()
    .default(null)
    .when('omitGuardianPoa', {
      is: false,
      then: string()
        .min(10, 'Must be a valid phone number')
        .typeError('Please enter a valid phone number')
        .required('Please enter a phone number'),
    }),
  relationshipToApplicant: string()
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
      then: string().typeError('Please enter a valid address').required('Please enter an address'),
    }),
  addressLine2: string().nullable().default(null),
  city: string()
    .nullable()
    .default(null)
    .when('omitGuardianPoa', {
      is: false,
      then: string()
        .typeError('Please enter a valid city')
        .matches(/^[a-zA-Z]*$/, 'Must only contain letters')
        .required('Please enter a city'),
    }),
  postalCode: string()
    .nullable()
    .default(null)
    .when('omitGuardianPoa', {
      is: false,
      then: string()
        .typeError('Please enter a valid postal code')
        .min(6, 'Must be a valid postal code')
        .max(7, 'Must be a valid postal code')
        .required('Please enter a postal code'),
    }),
});

export const editGuardianInformationFormSchema = object({
  guardianInformation: guardianInformationSchema,
});
