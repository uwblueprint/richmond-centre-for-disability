export default `
  type Employee {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    role: Role!
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
`;