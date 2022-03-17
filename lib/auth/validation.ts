import { object, string, date, array } from 'yup';

/**
 * Login validation schema
 */
export const loginSchema = object({
  email: string()
    .email('Please enter a valid email address')
    .required('Please enter a valid email address'),
  comments: string().required('Plz write smth'),
  date: date().max('2022-12-31', 'dec 31st 2020 is the max!').required(),
  checkboxOptions: array().min(3, 'A checkbox option is required'),
  paymentMethod: string().required('A radio option is required'),
  gender: string().required(),
});
