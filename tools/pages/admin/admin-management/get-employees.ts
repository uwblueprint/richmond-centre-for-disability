import { gql } from '@apollo/client'; // gql tag
import { Employee, EmployeesFilter } from '@lib/graphql/types'; // GraphQL types

/**
 * gql query to fetch all employees
 */
export const GET_EMPLOYEES_QUERY = gql`
  query getEmployees($filter: EmployeesFilter) {
    employees(filter: $filter) {
      result {
        id
        firstName
        lastName
        email
        role
      }
    }
  }
`;

/**
 * applied filter to employee request
 */
export type GetEmployeesRequest = {
  filter: EmployeesFilter;
};

/**
 * specifying fields given in response and data shape
 */
export type GetEmployeesResponse = {
  employees: {
    result: ReadonlyArray<Pick<Employee, 'id' | 'firstName' | 'lastName' | 'email' | 'role'>>;
  };
};
