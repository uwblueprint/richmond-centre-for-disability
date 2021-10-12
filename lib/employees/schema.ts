export default `
  type Employee {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    role: Role!
    active: Boolean!
  }

  input QueryEmployeeInput {
    id: ID
  }

  input CreateEmployeeInput {
    firstName: String!
    lastName: String!
    email: String!
    role: Role!
  }

  type CreateEmployeeResult {
    ok: Boolean!
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

  type DeleteEmployeeResult {
    ok: Boolean!
    employee: Employee!
  }

  input EmployeesFilter {
    order: [[String!]!]
    limit: Int
    offset: Int
  }

  type QueryEmployeesResult {
    result: [Employee!]!
    totalCount: Int!
  }
`;
