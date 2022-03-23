import { object, string } from 'yup';

/**
 * Expanded Guardian/POA validation schema
 */

export const guardianSchema = object({
  firstName: string()
    .matches(/^[a-zA-Z]*$/, 'Must only contain letters')
    .required('Please enter a first name'),
  middleName: string(),
  lastName: string()
    .matches(/^[a-zA-Z]*$/, 'Must only contain letters')
    .required('Please enter a last name'),
  phoneNumber: string()
    .min(10, 'Must be a valid phone number')
    .required('Please enter a phone number'),
  relationshipToApplicant: string().required('Please enter a relationship to applicant'),
  addressLine1: string().required('Please enter an address'),
  addressLine2: string(),
  city: string()
    .matches(/^[a-zA-Z]*$/, 'Must only contain letters')
    .required('Please enter a city'),
  postalCode: string()
    .length(7, 'Must be a valid postal code')
    .required('Please enter a postal code'),
});
