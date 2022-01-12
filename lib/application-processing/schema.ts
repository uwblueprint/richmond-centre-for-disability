/**
 * GraphQL schema for application processing
 */

import { gql } from '@apollo/client';

export default gql`
  type ApplicationProcessing {
    status: ApplicationStatus!
    rejectedReason: String
    appNumber: Int
    appNumberEmployeeId: Int
    appNumberUpdatedAt: Date
    appHolepunched: Boolean!
    appHolepunchedEmployeeId: Int
    appHolepunchedUpdatedAt: Date
    walletCardCreated: Boolean!
    walletCardCreatedEmployeeId: Int
    walletCardCreatedUpdatedAt: Date
    invoiceNumber: Int
    invoiceNumberEmployeeId: Int
    invoiceNumberUpdatedAt: Date
    documentsUrl: String
    documentsUrlEmployeeId: Int
    documentsUrlUpdatedAt: Date
    appMailed: Boolean!
    appMailedEmployeeId: Int
    appMailedUpdatedAt: Date
  }

  # Approve application
  input ApproveApplicationInput {
    # Application ID
    id: Int!
  }

  type ApproveApplicationResult {
    ok: Boolean!
  }

  # Reject application
  input RejectApplicationInput {
    # Application ID
    id: Int!

    # Reason for rejection
    reason: String!
  }

  type RejectApplicationResult {
    ok: Boolean!
  }

  # Complete application
  input CompleteApplicationInput {
    # Application ID
    id: Int!
  }

  type CompleteApplicationResult {
    ok: Boolean!
  }

  # Assign APP number to application
  input UpdateApplicationProcessingAssignAppNumberInput {
    applicationId: Int!

    appNumber: Int
  }

  type UpdateApplicationProcessingAssignAppNumberResult {
    ok: Boolean!
  }

  # Holepunch permit card
  input UpdateApplicationProcessingHolepunchParkingPermitInput {
    applicationId: Int!

    appHolepunched: Boolean!
  }

  type UpdateApplicationProcessingHolepunchParkingPermitResult {
    ok: Boolean!
  }

  # Create wallet card to mail to applicant
  input UpdateApplicationProcessingCreateWalletCardInput {
    applicationId: Int!

    walletCardCreated: Boolean!
  }

  type UpdateApplicationProcessingCreateWalletCardResult {
    ok: Boolean!
  }

  # Assign invoice number to application
  input UpdateApplicationProcessingAssignInvoiceNumberInput {
    applicationId: Int!

    invoiceNumber: Int
  }

  type UpdateApplicationProcessingAssignInvoiceNumberResult {
    ok: Boolean!
  }

  # Upload scans of application documents
  input UpdateApplicationProcessingUploadDocumentsInput {
    applicationId: Int!

    documentsUrl: String # TODO: Investigate FE vs BE file upload to AWS
  }

  type UpdateApplicationProcessingUploadDocumentsResult {
    ok: Boolean!
  }

  # Mail application to applicant
  input UpdateApplicationProcessingMailOutInput {
    applicationId: Int!

    appMailed: Boolean!
  }

  type UpdateApplicationProcessingMailOutResult {
    ok: Boolean!
  }

  # input UpdateApplicationProcessingInput {
  #   applicationId: Int!
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
