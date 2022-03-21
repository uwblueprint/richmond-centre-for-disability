import { object, string, date, number } from 'yup';

/**
 * Verify identity validation schema
 */
export const verifyIdentitySchema = object({
  userId: number()
    .typeError('User ID must be a positive number')
    .required('Please enter your User ID')
    .positive('User ID must be a positive number')
    .integer('Please enter your User ID'),
  phoneNumberSuffix: string()
    .matches(/^\d+$/, 'Must only contain numbers')
    .required('Please enter the last 4 digits of your phone number')
    .length(4, 'Must be exactly 4 digits'),
  dateOfBirth: date().required('Please enter your date of birth'),
});
