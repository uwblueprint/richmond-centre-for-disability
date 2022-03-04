import { object, string } from 'yup';

/**
 * Login validation schema
 */
export const loginSchema = object({
  email: string().email('Invalid email address').required('Required field'),
});
