import gql from 'graphql-tag'; // GraphQL tag

export default gql`
  type Permit {
    id: Int!
    rcdPermitId: Int!
    expiryDate: Date!
    receiptId: Int
    active: Boolean!
    application: Application!
    applicationId: Int!
    applicant: Applicant!
    applicantId: Int!
  }

  input CreatePermitInput {
    rcdPermitId: Int!
    expiryDate: Date!
    receiptId: Int
    active: Boolean!
    applicationId: Int!
    applicantId: Int!
  }

  type CreatePermitResult {
    ok: Boolean!
  }
`;
