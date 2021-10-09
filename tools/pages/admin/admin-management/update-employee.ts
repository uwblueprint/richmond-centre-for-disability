import { gql } from '@apollo/client'; // gql tag
import { UpdateEmployeeInput } from '@lib/graphql/types'; // GraphQL types

/**
 * GQL query to fetch employees based on filter
 */
export const UPDATE_EMPLYEE_MUTATION = gql`
  mutation updateEmployee($input: UpdateEmployeeInput) {
    employees(input: $input) {
      result {
        ok
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
  };
};
