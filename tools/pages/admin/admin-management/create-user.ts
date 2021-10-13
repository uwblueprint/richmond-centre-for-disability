import { Employee } from '@prisma/client';
import { gql } from '@apollo/client'; // gql tag
import { CreateEmployeeInput } from '@lib/graphql/types'; // GraphQL types

/**
 * GQL query to create new employees
 */
export const CREATE_EMPLOYEE_MUTATION = gql`
  mutation createEmployeeMutation($input: CreateEmployeeInput!) {
    createEmployee(input: $input) {
      ok
      employee {
        firstName
        lastName
      }
    }
  }
`;

/**
 * Input parameters for creating new employees
 */
export type CreateNewEmployeeRequest = {
  input: CreateEmployeeInput;
};

/**
 * Response type of creating new employees
 */
export type CreateNewEmployeeResponse = {
  createEmployee: {
    ok: true | false;
    employee: Employee;
  };
};
