import { gql } from '@apollo/client'; // GraphQL queries
import { Application, ApplicationProcessing, QueryApplicationArgs } from '@lib/graphql/types';

// Queries an Application by ID along with the associated permit, replacement, applicationProcessing, and applicant
export const GET_APPLICATION_QUERY = gql`
  query GetApplication($id: Int!) {
    application(id: $id) {
      id
      type
      createdAt
      processing {
        status
        appNumber
        appHolepunched
        walletCardCreated
        invoiceNumber
        documentsUrl
        appMailed
      }
    }
  }
`;

// Get application request type
export type GetApplicationRequest = QueryApplicationArgs;

// Get application response type
// TODO: Account for application types
export type GetApplicationResponse = {
  application: Pick<Application, 'id' | 'type' | 'createdAt'> & {
    processing: Pick<
      ApplicationProcessing,
      | 'status'
      | 'appNumber'
      | 'appHolepunched'
      | 'walletCardCreated'
      | 'invoiceNumber'
      | 'documentsUrl'
      | 'appMailed'
    >;
  };
};