import gql from 'graphql-tag'; // GraphQL tag

export default gql`
  type ApplicationProcessing {
    id: Int!
    status: ApplicationStatus!
    appNumber: Int
    appHolepunched: Boolean!
    walletCardCreated: Boolean!
    invoiceNumber: Int
    documentUrls: [String!]
    appMailed: Boolean!
    createdAt: Date!
    updatedAt: Date!
    application: Application!
  }

  input UpdateApplicationProcessingInput {
    applicationId: ID!
    status: ApplicationStatus
    appNumber: Int
    appHolepunched: Boolean
    walletCardCreated: Boolean
    invoiceNumber: Int
    documentUrl: String
    appMailed: Boolean
  }

  type UpdateApplicationProcessingResult {
    ok: Boolean!
  }

  type CompleteApplicationResult {
    ok: Boolean!
  }

  type ApplicationFileAttachments {
    documentUrls: [String!]
    appNumber: Int
    createdAt: Date!
  }
`;
