import { Role } from '@prisma/client';
import { object, string, mixed } from 'yup';

export const employeeSchema = object({
  firstName: string().required(),
  lastName: string().required(),
  email: string().email().required(),
  role: mixed<keyof typeof Role>().oneOf(Object.values(Role)),
});
