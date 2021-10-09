import { gql } from '@apollo/client'; // gql tag
import { MutationDeleteEmployeeArgs, DeleteEmployeeResult } from '@lib/graphql/types';

export const DELETE_EMPLOYEE_MUTATION = gql`
  mutation DeleteEmployeeMutation($input: DeleteEmployeeInput!) {
    deleteEmployee(input: $input) {
      ok
    }
  }
`;

export type DeleteEmployeeRequest = MutationDeleteEmployeeArgs;

export type DeleteEmployeeResponse = {
  deleteEmployee: DeleteEmployeeResult;
};
