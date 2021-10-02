import { Role } from '@lib/types';

export type EmployeeData = {
  name: {
    firstName: string;
    lastName: string;
  };
  email: string;
  role: Role;
};
