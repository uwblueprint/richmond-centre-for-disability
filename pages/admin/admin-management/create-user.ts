import { Employee } from '.prisma/client';
import { gql } from '@apollo/client'; // gql tag
import { CreateEmployeeInput } from '@lib/graphql/types'; // GraphQL types

/**
 * GQL query to fetch employees based on filter
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
 * Input parameters for fetch all employees
 */
export type CreateNewEmployeeRequest = {
  input: CreateEmployeeInput;
};

/**
 * Response type of getting employees
 */
export type CreateNewEmployeeResponse = {
  createEmployee: {
    ok: true | false;
    employee: Employee;
  };
};
