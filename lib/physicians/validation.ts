import { object, string } from 'yup';

/**
 * Create New / Doctor's Information validation schema
 */

export const physicianSchema = object({
  firstName: string()
    .matches(/^[a-zA-Z]*$/, 'Must only contain letters')
    .required('Please enter a first name'),
  lastName: string()
    .matches(/^[a-zA-Z]*$/, 'Must only contain letters')
    .required('Please enter a last name'),
  mspNumber: string()
    .matches(/^\d+$/, 'Must only contain numbers')
    .required('Please enter the MSP number'),
  phoneNumber: string()
    .min(10, 'Must be a valid phone number')
    .required('Please enter a phone number'),
  addressLine1: string().required('Please enter an address'),
  addressLine2: string(),
  city: string()
    .matches(/^[a-zA-Z]*$/, 'Must only contain letters')
    .required('Please enter a city'),
  postalCode: string()
    .length(7, 'Must be a valid postal code')
    .required('Please enter a postal code'),
});
