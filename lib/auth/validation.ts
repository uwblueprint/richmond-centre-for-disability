import { object, string } from 'yup';

/**
 * Login validation schema
 */
export const loginSchema = object({
  email: string().email().required(),
});
