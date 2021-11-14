import gql from 'graphql-tag'; // GraphQL tag

export default gql`
  type Guardian {
    id: Int!
    firstName: String!
    middleName: String
    lastName: String!
    addressLine1: String!
    addressLine2: String
    city: String!
    province: Province!
    postalCode: String!
    phone: String!
    relationship: String!
    notes: String
  }

  # Fields to specify when creating a guardian record for an applicant
  input CreateGuardianInput {
    firstName: String!
    middleName: String
    lastName: String!
    addressLine1: String!
    addressLine2: String
    city: String!
    province: Province!
    postalCode: String!
    phone: String!
    relationship: String!
    notes: String
  }

  input UpdateGuardianInput {
    applicantId: Int!
    firstName: String
    middleName: String
    lastName: String
    addressLine1: String
    addressLine2: String
    city: String
    province: Province
    postalCode: String
    phone: String
    relationship: String
    notes: String
  }

  type UpdateGuardianResult {
    ok: Boolean!
  }
`;
