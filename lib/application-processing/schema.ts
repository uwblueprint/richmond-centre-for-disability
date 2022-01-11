/**
 * GraphQL schema for application processing
 */

import { gql } from '@apollo/client';

export default gql`
  type ApplicationProcessing {
    status: ApplicationStatus!
    rejectedReason: String
    appNumber: Int
    appNumberEmployeeId: ID
    appNumberUpdatedAt: Date
    appHolepunched: Boolean!
    appHolepunchedEmployeeId: ID
    appHolepunchedUpdatedAt: Date
    walletCardCreated: Boolean!
    walletCardCreatedEmployeeId: ID
    walletCardCreatedUpdatedAt: Date
    invoiceNumber: Int
    invoiceNumberEmployeeId: ID
    invoiceNumberUpdatedAt: Date
    documentsUrl: String
    documentsUrlEmployeeId: ID
    documentsUrlUpdatedAt: Date
    appMailed: Boolean!
    appMailedEmployeeId: ID
    appMailedUpdatedAt: Date
  }

  # Approve application
  input ApproveApplicationInput {
    # Application ID
    id: ID!
  }

  type ApproveApplicationResult {
    ok: Boolean!
  }

  # Reject application
  input RejectApplicationInput {
    # Application ID
    id: ID!

    # Reason for rejection
    reason: String!
  }

  type RejectApplicationResult {
    ok: Boolean!
  }

  # Complete application
  input CompleteApplicationInput {
    # Application ID
    id: ID!
  }

  type CompleteApplicationResult {
    ok: Boolean!
  }

  # Assign APP number to application
  input UpdateApplicationProcessingAssignAppNumberInput {
    applicationId: ID!

    appNumber: Int
  }

  type UpdateApplicationProcessingAssignAppNumberResult {
    ok: Boolean!
  }

  # Holepunch permit card
  input UpdateApplicationProcessingHolepunchParkingPermitInput {
    applicationId: ID!

    appHolepunched: Boolean!
  }

  type UpdateApplicationProcessingHolepunchParkingPermitResult {
    ok: Boolean!
  }

  # Create wallet card to mail to applicant
  input UpdateApplicationProcessingCreateWalletCardInput {
    applicationId: ID!

    walletCardCreated: Boolean!
  }

  type UpdateApplicationProcessingCreateWalletCardResult {
    ok: Boolean!
  }

  # Assign invoice number to application
  input UpdateApplicationProcessingAssignInvoiceNumberInput {
    applicationId: ID!

    invoiceNumber: Int
  }

  type UpdateApplicationProcessingAssignInvoiceNumberResult {
    ok: Boolean!
  }

  # Upload scans of application documents
  input UpdateApplicationProcessingUploadDocumentsInput {
    applicationId: ID!

    documentsUrl: String # TODO: Investigate FE vs BE file upload to AWS
  }

  type UpdateApplicationProcessingUploadDocumentsResult {
    ok: Boolean!
  }

  # Mail application to applicant
  input UpdateApplicationProcessingMailOutInput {
    applicationId: ID!

    appMailed: Boolean!
  }

  type UpdateApplicationProcessingMailOutResult {
    ok: Boolean!
  }

  # input UpdateApplicationProcessingInput {
  #   applicationId: ID!
  #   status: ApplicationStatus
  #   appNumber: Int
  #   appHolepunched: Boolean
  #   walletCardCreated: Boolean
  #   invoiceNumber: Int
  #   documentUrl: String
  #   appMailed: Boolean
  # }

  # type UpdateApplicationProcessingResult {
  #   ok: Boolean!
  # }

  # type ApplicationFileAttachments {
  #   documentUrls: [String!]
  #   appNumber: Int
  #   createdAt: Date!
  # }
`;
