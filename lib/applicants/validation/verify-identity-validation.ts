import { object, string, date } from 'yup';

// const lengthOf4 = str => {
//   return str === 4;
// };
/**
 * Login validation schema
 */
export const verifyIdentitySchema = object({
  userId: string().matches(/^\d+$/).required(),
  phoneNumberSuffix: string().matches(/^\d+$/).required().min(4, 'Sigh').max(4),
  // .test('length', 'Must be 4 digits', val => val.length === 4)
  // .length(4, 'Must be 4 digits')
  // .min(4)
  // .max(4),
  dateOfBirth: date().required(),
});
