import gql from 'graphql-tag'; // gql tag
import { Employee, EmployeesFilter } from '@lib/graphql/types'; // GraphQL types

/**
 * GQL query to fetch employees based on filter
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
      totalCount
    }
  }
`;

/**
 * Input parameters for fetch all employees
 */
export type GetEmployeesRequest = {
  filter: EmployeesFilter;
};

/**
 * Response type of getting employees
 */
export type GetEmployeesResponse = {
  employees: {
    result: ReadonlyArray<Pick<Employee, 'id' | 'firstName' | 'lastName' | 'email' | 'role'>>;
    totalCount: number;
  };
};
