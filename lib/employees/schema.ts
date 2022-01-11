/**
 * GraphQL schema for employees
 */

import { gql } from '@apollo/client';

export default gql`
  type Employee {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    role: Role!
  }

  input CreateEmployeeInput {
    firstName: String!
    lastName: String!
    email: String!
    role: Role!
  }

  type CreateEmployeeResult {
    ok: Boolean!
    employee: Employee!
  }

  input UpdateEmployeeInput {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    role: Role!
  }

  type UpdateEmployeeResult {
    ok: Boolean!
    employee: Employee!
  }

  input DeleteEmployeeInput {
    id: ID!
  }

  type DeleteEmployeeResult {
    ok: Boolean!
    employee: Employee!
  }

  input EmployeesFilter {
    order: [[String!]!]
    limit: Int
    offset: Int
  }

  type EmployeesResult {
    result: [Employee!]!
    totalCount: Int!
  }
`;
