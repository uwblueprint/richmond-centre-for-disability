import { gql } from '@apollo/client'; // gql tag
import { MutationDeleteEmployeeArgs, DeleteEmployeeResult } from '@lib/graphql/types'; // GraphQL types

/**
 * GQL query to delete employee
 */
export const DELETE_EMPLOYEE_MUTATION = gql`
  mutation DeleteEmployeeMutation($input: DeleteEmployeeInput!) {
    deleteEmployee(input: $input) {
      ok
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
  deleteEmployee: DeleteEmployeeResult;
};
