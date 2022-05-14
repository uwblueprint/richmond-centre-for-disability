/**
 * GraphQL schema for application processing
 */

import { gql } from '@apollo/client';

// TODO: Add nested resolver support for employees
export default gql`
  type ApplicationProcessing {
    status: ApplicationStatus!
    rejectedReason: String
    appNumber: Int
    appNumberEmployee: Employee
    appNumberUpdatedAt: Date
    appHolepunched: Boolean!
    appHolepunchedEmployee: Employee
    appHolepunchedUpdatedAt: Date
    walletCardCreated: Boolean!
    walletCardCreatedEmployee: Employee
    walletCardCreatedUpdatedAt: Date
    reviewRequestCompleted: Boolean!
    reviewRequestCompletedEmployee: Employee
    reviewRequestCompletedUpdatedAt: Date
    invoice: Invoice
    documentsUrl: String
    documentsS3ObjectKey: String
    documentsUrlEmployee: Employee
    documentsUrlUpdatedAt: Date
    appMailed: Boolean!
    appMailedEmployee: Employee
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

  # Review Request Information
  input UpdateApplicationProcessingReviewRequestInformationInput {
    applicationId: Int!

    reviewRequestCompleted: Boolean!
  }

  type UpdateApplicationProcessingReviewRequestInformationResult {
    ok: Boolean!
  }

  # Generate invoice PDF for application
  input UpdateApplicationProcessingGenerateInvoiceInput {
    applicationId: Int!
  }

  type UpdateApplicationProcessingGenerateInvoiceResult {
    ok: Boolean!
  }

  # Upload scans of application documents
  input UpdateApplicationProcessingUploadDocumentsInput {
    applicationId: Int!

    documentsS3ObjectKey: String # TODO: Investigate FE vs BE file upload to AWS
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
`;
