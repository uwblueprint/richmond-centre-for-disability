import { gql } from '@apollo/client'; // GraphQL queries
import {
  Application,
  ApplicationProcessing,
  Invoice,
  Applicant,
  QueryApplicationArgs,
} from '@lib/graphql/types';

// Queries an Application by ID along with the associated permit, replacement, applicationProcessing, and applicant
export const GET_APPLICATION_QUERY = gql`
  query GetApplication($id: Int!) {
    application(id: $id) {
      id
      type
      createdAt
      paidThroughShopify
      processing {
        status
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
      }
    }
  }
`;

// Get application request type
export type GetApplicationRequest = QueryApplicationArgs;

// Get application response type
// TODO: Account for application types
export type GetApplicationResponse = {
  application: Pick<Application, 'id' | 'type' | 'paidThroughShopify' | 'createdAt'> & {
    processing: Pick<
      ApplicationProcessing,
      | 'status'
      | 'appNumber'
      | 'appHolepunched'
      | 'walletCardCreated'
      | 'documentsUrl'
      | 'appMailed'
      | 'reviewRequestCompleted'
    > & {
      invoice: Pick<Invoice, 'invoiceNumber' | 's3ObjectKey' | 's3ObjectUrl'>;
    };
  } & {
    applicant: Pick<Applicant, 'id'>;
  };
};
