import { object, string } from 'yup';

/**
 * Login validation schema
 */
export const loginSchema = object({
  email: string()
    .email('Please enter a valid email address')
    .required('Please enter a valid email address'),
});
