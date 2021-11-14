import { Role } from '@lib/graphql/types'; //GraphQL types

/**
 * Employee data type for admin-management table
 */
export type EmployeeData = {
  id: number;
  name: {
    firstName: string;
    lastName: string;
  };
  email: string;
  role: Role;
};

/**
 * User type in Confirm Delete Admin modal
 */
export type UserToDelete = {
  readonly id: number;
  readonly name: string;
};
