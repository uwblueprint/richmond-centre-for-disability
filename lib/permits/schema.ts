export default `
  type Permit {
    id: ID!
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
