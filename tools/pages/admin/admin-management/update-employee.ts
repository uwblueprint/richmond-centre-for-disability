import { Employee } from '.prisma/client';
import { gql } from '@apollo/client'; // gql tag
import { UpdateEmployeeInput } from '@lib/graphql/types'; // GraphQL types

/**
 * GQL query to fetch employees based on filter
 */
export const UPDATE_EMPLOYEE_MUTATION = gql`
  mutation updateEmployeeMutation($input: UpdateEmployeeInput!) {
    updateEmployee(input: $input) {
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
export type UpdateEmployeeRequest = {
  input: UpdateEmployeeInput;
};

/**
 * Response type of getting employees
 */
export type UpdateEmployeeResponse = {
  updateEmployee: {
    ok: true | false;
    employee: Employee;
  };
};
