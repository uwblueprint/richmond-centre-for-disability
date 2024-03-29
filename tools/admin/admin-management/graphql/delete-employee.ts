import { Employee } from '@prisma/client';
import { gql } from '@apollo/client'; // gql tag
import { DeleteEmployeeInput } from '@lib/graphql/types'; // GraphQL types

/**
 * GQL query to delete employee
 */
export const DELETE_EMPLOYEE_MUTATION = gql`
  mutation DeleteEmployeeMutation($input: DeleteEmployeeInput!) {
    deleteEmployee(input: $input) {
      ok
      employee {
        firstName
        lastName
      }
    }
  }
`;

/**
 * Input parameters for delete employee
 */
export type DeleteEmployeeRequest = {
  input: DeleteEmployeeInput;
};

/**
 * Response type of delete employee
 */
export type DeleteEmployeeResponse = {
  deleteEmployee: {
    ok: boolean;
    employee: Employee;
  };
};
