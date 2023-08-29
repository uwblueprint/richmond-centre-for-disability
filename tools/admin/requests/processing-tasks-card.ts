import { gql } from '@apollo/client'; // GraphQL queries
import {
  ApplicationProcessing,
  MutationUpdateApplicationProcessingAssignAppNumberArgs,
  MutationUpdateApplicationProcessingGenerateInvoiceArgs,
  MutationUpdateApplicationProcessingCreateWalletCardArgs,
  MutationUpdateApplicationProcessingHolepunchParkingPermitArgs,
  MutationUpdateApplicationProcessingMailOutArgs,
  MutationUpdateApplicationProcessingUploadDocumentsArgs,
  MutationUpdateApplicationProcessingReviewRequestInformationArgs,
  QueryApplicationArgs,
  UpdateApplicationProcessingAssignAppNumberResult,
  UpdateApplicationProcessingGenerateInvoiceResult,
  UpdateApplicationProcessingCreateWalletCardResult,
  UpdateApplicationProcessingHolepunchParkingPermitResult,
  UpdateApplicationProcessingMailOutResult,
  UpdateApplicationProcessingUploadDocumentsResult,
  UpdateApplicationProcessingReviewRequestInformationResult,
  Invoice,
  Employee,
  Application,
  MutationUpdateApplicationProcessingRefundPaymentArgs,
  UpdateApplicationProcessingRefundPaymentResult,
} from '@lib/graphql/types';

/** Get application processing */
export const GET_APPLICATION_PROCESSING = gql`
  query GetApplicationProcessing($id: Int!) {
    application(id: $id) {
      paidThroughShopify
      shopifyConfirmationNumber
      shopifyOrderNumber
      processing {
        status
        appNumber
        appNumberEmployee {
          firstName
          lastName
        }
        appNumberUpdatedAt
        appHolepunched
        appHolepunchedEmployee {
          firstName
          lastName
        }
        appHolepunchedUpdatedAt
        walletCardCreated
        walletCardCreatedEmployee {
          firstName
          lastName
        }
        walletCardCreatedUpdatedAt
        invoice {
          invoiceNumber
          s3ObjectUrl
          s3ObjectKey
          employee {
            firstName
            lastName
          }
          updatedAt
        }
        documentsUrl
        documentsUrlEmployee {
          firstName
          lastName
        }
        documentsUrlUpdatedAt
        appMailed
        appMailedEmployee {
          firstName
          lastName
        }
        appMailedUpdatedAt
        reviewRequestCompleted
        reviewRequestCompletedEmployee {
          firstName
          lastName
        }
        reviewRequestCompletedUpdatedAt
        paymentRefunded
        paymentRefundedEmployee {
          firstName
          lastName
        }
        paymentRefundedUpdatedAt
      }
    }
  }
`;

export type GetApplicationProcessingRequest = QueryApplicationArgs;

export type GetApplicationProcessingResponse = {
  application: Pick<
    Application,
    'paidThroughShopify' | 'shopifyConfirmationNumber' | 'shopifyOrderNumber'
  > & {
    processing: Pick<
      ApplicationProcessing,
      | 'status'
      | 'appNumber'
      | 'appNumberUpdatedAt'
      | 'appHolepunched'
      | 'appHolepunchedUpdatedAt'
      | 'walletCardCreated'
      | 'walletCardCreatedUpdatedAt'
      | 'documentsUrl'
      | 'documentsUrlUpdatedAt'
      | 'appMailed'
      | 'appMailedUpdatedAt'
      | 'reviewRequestCompleted'
      | 'reviewRequestCompletedUpdatedAt'
      | 'paymentRefunded'
      | 'paymentRefundedUpdatedAt'
    > & {
      invoice: Pick<Invoice, 'invoiceNumber' | 's3ObjectKey' | 's3ObjectUrl' | 'updatedAt'> & {
        employee: Pick<Employee, 'firstName' | 'lastName'>;
      };
      taxReceipt: Pick<Invoice, 'invoiceNumber' | 's3ObjectKey' | 's3ObjectUrl' | 'updatedAt'> & {
        employee: Pick<Employee, 'firstName' | 'lastName'>;
      };
      appNumberEmployee: Pick<Employee, 'firstName' | 'lastName'> | null;
      appHolepunchedEmployee: Pick<Employee, 'firstName' | 'lastName'> | null;
      walletCardCreatedEmployee: Pick<Employee, 'firstName' | 'lastName'> | null;
      documentsUrlEmployee: Pick<Employee, 'firstName' | 'lastName'> | null;
      appMailedEmployee: Pick<Employee, 'firstName' | 'lastName'> | null;
      reviewRequestCompletedEmployee: Pick<Employee, 'firstName' | 'lastName'> | null;
      paymentRefundedEmployee: Pick<Employee, 'firstName' | 'lastName'> | null;
    };
  };
};

/** Assign APP number task */
export const ASSIGN_APP_NUMBER_MUTATION = gql`
  mutation AssignAppNumber($input: UpdateApplicationProcessingAssignAppNumberInput!) {
    updateApplicationProcessingAssignAppNumber(input: $input) {
      ok
    }
  }
`;

export type AssignAppNumberRequest = MutationUpdateApplicationProcessingAssignAppNumberArgs;

export type AssignAppNumberResponse = {
  updateApplicationProcessingAssignAppNumber: UpdateApplicationProcessingAssignAppNumberResult;
};

/** Holepunch APP task */
export const HOLEPUNCH_APP_MUTATION = gql`
  mutation HolepunchParkingPermit($input: UpdateApplicationProcessingHolepunchParkingPermitInput!) {
    updateApplicationProcessingHolepunchParkingPermit(input: $input) {
      ok
    }
  }
`;

export type HolepunchParkingPermitRequest =
  MutationUpdateApplicationProcessingHolepunchParkingPermitArgs;

export type HolepunchParkingPermitResponse = {
  updateApplicationProcessingHolepunchParkingPermit: UpdateApplicationProcessingHolepunchParkingPermitResult;
};

/** Create new wallet card task */
export const CREATE_WALLET_CARD_MUTATION = gql`
  mutation CreateWalletCard($input: UpdateApplicationProcessingCreateWalletCardInput!) {
    updateApplicationProcessingCreateWalletCard(input: $input) {
      ok
    }
  }
`;

export type CreateWalletCardRequest = MutationUpdateApplicationProcessingCreateWalletCardArgs;

export type CreateWalletCardResponse = {
  updateApplicationProcessingCreateWalletCard: UpdateApplicationProcessingCreateWalletCardResult;
};

/** Review request information task */
export const REVIEW_REQUEST_INFORMATION_MUTATION = gql`
  mutation ReviewRequestInformation(
    $input: UpdateApplicationProcessingReviewRequestInformationInput!
  ) {
    updateApplicationProcessingReviewRequestInformation(input: $input) {
      ok
    }
  }
`;

export type ReviewRequestInformationRequest =
  MutationUpdateApplicationProcessingReviewRequestInformationArgs;

export type ReviewRequestInformationResponse = {
  updateApplicationProcessingReviewRequestInformation: UpdateApplicationProcessingReviewRequestInformationResult;
};

/** Assign invoice number task */
export const GENERATE_INVOICE_MUTATION = gql`
  mutation AssignInvoiceNumber($input: UpdateApplicationProcessingGenerateInvoiceInput!) {
    updateApplicationProcessingGenerateInvoice(input: $input) {
      ok
    }
  }
`;

export type GenerateInvoiceRequest = MutationUpdateApplicationProcessingGenerateInvoiceArgs;

export type GenerateInvoiceResponse = {
  updateApplicationProcessingGenerateInvoice: UpdateApplicationProcessingGenerateInvoiceResult;
};

/** Upload documents task */
export const UPLOAD_DOCUMENTS_MUTATION = gql`
  mutation UploadDocuments($input: UpdateApplicationProcessingUploadDocumentsInput!) {
    updateApplicationProcessingUploadDocuments(input: $input) {
      ok
    }
  }
`;

export type UploadDocumentsRequest = MutationUpdateApplicationProcessingUploadDocumentsArgs;

export type UploadDocumentsResponse = {
  updateApplicationProcessingUploadDocuments: UpdateApplicationProcessingUploadDocumentsResult;
};

/** Mail out APP task */
export const MAIL_OUT_APP_MUTATION = gql`
  mutation MailOut($input: UpdateApplicationProcessingMailOutInput!) {
    updateApplicationProcessingMailOut(input: $input) {
      ok
    }
  }
`;

export type MailOutRequest = MutationUpdateApplicationProcessingMailOutArgs;

export type MailOutResponse = {
  updateApplicationProcessingMailOut: UpdateApplicationProcessingMailOutResult;
};

/** Refund payment APP task */
export const REFUND_PAYMENT_MUTATION = gql`
  mutation RefundPayment($input: UpdateApplicationProcessingRefundPaymentInput!) {
    updateApplicationProcessingRefundPayment(input: $input) {
      ok
    }
  }
`;

export type RefundPaymentRequest = MutationUpdateApplicationProcessingRefundPaymentArgs;

export type RefundPaymentResponse = {
  updateApplicationProcessingRefundPayment: UpdateApplicationProcessingRefundPaymentResult;
};
