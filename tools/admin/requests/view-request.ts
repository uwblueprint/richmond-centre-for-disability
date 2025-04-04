import { gql } from '@apollo/client'; // GraphQL queries
import {
  Application,
  ApplicationProcessing,
  Invoice,
  Applicant,
  QueryApplicationArgs,
  Permit,
} from '@lib/graphql/types';
import { CurrentApplication } from '@tools/admin/permit-holders/current-application';

// Queries an Application by ID along with the associated permit, replacement, applicationProcessing, and applicant
export const GET_APPLICATION_QUERY = gql`
  query GetApplication($id: Int!) {
    application(id: $id) {
      id
      __typename
      type
      createdAt
      paidThroughShopify
      shopifyConfirmationNumber
      shopifyOrderNumber
      permitType
      ... on NewApplication {
        temporaryPermitExpiry
      }
      processing {
        status
        rejectedReason
        appNumber
        appHolepunched
        walletCardCreated
        invoice {
          invoiceNumber
          s3ObjectUrl
          s3ObjectKey
        }
        documentsUrl
        appMailed
        reviewRequestCompleted
      }
      applicant {
        id
        mostRecentPermit {
          expiryDate
        }
        mostRecentApplication {
          processing {
            status
          }
        }
      }
      permit {
        expiryDate
      }
    }
  }
`;

// Get application request type
export type GetApplicationRequest = QueryApplicationArgs;

// Get application response type
// TODO: Account for application types
export type GetApplicationResponse = {
  application: Pick<
    Application,
    | 'id'
    | 'type'
    | 'paidThroughShopify'
    | 'createdAt'
    | 'shopifyConfirmationNumber'
    | 'shopifyOrderNumber'
    | 'permitType'
  > & {
    processing: Pick<
      ApplicationProcessing,
      | 'status'
      | 'rejectedReason'
      | 'appNumber'
      | 'appHolepunched'
      | 'walletCardCreated'
      | 'documentsUrl'
      | 'appMailed'
      | 'reviewRequestCompleted'
    > & {
      invoice: Pick<Invoice, 'invoiceNumber' | 's3ObjectKey' | 's3ObjectUrl'>;
    };
    applicant: Pick<Applicant, 'id'> & {
      mostRecentPermit: Pick<Permit, 'expiryDate'> | null;
      mostRecentApplication: CurrentApplication | null;
    };
    temporaryPermitExpiry?: Date;
    permit: Pick<Permit, 'expiryDate'> | null;
  };
};
