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
    paymentRefunded: Boolean!
    paymentRefundedEmployee: Employee
    paymentRefundedUpdatedAt: Date
  }

  # Approve application
  input ApproveApplicationInput {
    # Application ID
    id: Int!
  }

  type ApproveApplicationResult {
    ok: Boolean!
    error: String
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
    error: String
  }

  # Complete application
  input CompleteApplicationInput {
    # Application ID
    id: Int!
  }

  type CompleteApplicationResult {
    ok: Boolean!
    error: String
  }

  # Assign APP number to application
  input UpdateApplicationProcessingAssignAppNumberInput {
    applicationId: Int!

    appNumber: Int
  }

  type UpdateApplicationProcessingAssignAppNumberResult {
    ok: Boolean!
    error: String
  }

  # Holepunch permit card
  input UpdateApplicationProcessingHolepunchParkingPermitInput {
    applicationId: Int!

    appHolepunched: Boolean!
  }

  type UpdateApplicationProcessingHolepunchParkingPermitResult {
    ok: Boolean!
    error: String
  }

  # Create wallet card to mail to applicant
  input UpdateApplicationProcessingCreateWalletCardInput {
    applicationId: Int!

    walletCardCreated: Boolean!
  }

  type UpdateApplicationProcessingCreateWalletCardResult {
    ok: Boolean!
    error: String
  }

  # Review Request Information
  input UpdateApplicationProcessingReviewRequestInformationInput {
    applicationId: Int!

    reviewRequestCompleted: Boolean!
  }

  type UpdateApplicationProcessingReviewRequestInformationResult {
    ok: Boolean!
    error: String
  }

  # Generate invoice PDF for application
  input UpdateApplicationProcessingGenerateInvoiceInput {
    applicationId: Int!
    isDonation: Boolean!
  }

  type UpdateApplicationProcessingGenerateInvoiceResult {
    ok: Boolean!
    error: String
  }

  # Upload scans of application documents
  input UpdateApplicationProcessingUploadDocumentsInput {
    applicationId: Int!

    documentsS3ObjectKey: String # TODO: Investigate FE vs BE file upload to AWS
  }

  type UpdateApplicationProcessingUploadDocumentsResult {
    ok: Boolean!
    error: String
  }

  # Mail application to applicant
  input UpdateApplicationProcessingMailOutInput {
    applicationId: Int!

    appMailed: Boolean!
  }

  type UpdateApplicationProcessingMailOutResult {
    ok: Boolean!
    error: String
  }

  # Refund application payment (cannot undo)
  input UpdateApplicationProcessingRefundPaymentInput {
    applicationId: Int!
  }

  type UpdateApplicationProcessingRefundPaymentResult {
    ok: Boolean!
    error: String
  }
`;
