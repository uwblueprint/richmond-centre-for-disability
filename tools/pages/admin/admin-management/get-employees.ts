import { gql } from '@apollo/client'; // gql tag
import { Employee, EmployeesFilter } from '@lib/graphql/types';

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

export type GetEmployeesRequest = {
  filter: EmployeesFilter;
};

export type GetEmployeesResponse = {
  employees: {
    result: ReadonlyArray<Pick<Employee, 'id' | 'firstName' | 'lastName' | 'email' | 'role'>>;
  };
};
