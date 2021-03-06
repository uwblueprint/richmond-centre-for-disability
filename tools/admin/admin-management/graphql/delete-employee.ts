import { Employee } from '@prisma/client';
import { gql } from '@apollo/client'; // gql tag
import { MutationDeleteEmployeeArgs } from '@lib/graphql/types'; // GraphQL types

// TODO: FIX INPUT FORMAT OF DELETE EMPLOYEE

/**
 * GQL query to delete employee
 */
export const DELETE_EMPLOYEE_MUTATION = gql`
  mutation DeleteEmployeeMutation($id: Int!) {
    deleteEmployee(id: $id) {
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
export type DeleteEmployeeRequest = MutationDeleteEmployeeArgs;

/**
 * Response type of delete employee
 */
export type DeleteEmployeeResponse = {
  deleteEmployee: {
    ok: boolean;
    employee: Employee;
  };
};
