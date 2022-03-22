import { Gender } from '@prisma/client';
import { boolean, date, mixed, object, string } from 'yup';

export const permitHolderInformationSchema = object({
  firstName: string().required('Please enter a first name'),
  middleName: string().nullable(),
  lastName: string().required('Please enter a last name'),
  dateOfBirth: date().required('Please enter your date of birth'),
  gender: mixed<Gender>().oneOf(Object.values(Gender)).required('Please select a gender'),
  otherGender: string().nullable(),
  email: string().email('Please enter a valid email address').nullable(),
  phone: string().required('Please enter a valid phone number'),
  // .length(10, 'Must be exactly 10 digits'), TODO??
  receiveEmailUpdates: boolean(),
  addressLine1: string().required('Please enter an address'),
  addressLine2: string().nullable(),
  city: string().required('Please enter a city'),
  postalCode: string()
    .required('Please enter a valid postal code')
    .min(7, 'Please enter a valid postal code'),
});
