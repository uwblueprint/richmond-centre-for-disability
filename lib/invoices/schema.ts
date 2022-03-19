/**
 * GraphQL schema for invoices
 */

import { gql } from '@apollo/client';

export default gql`
  type Invoice {
    invoiceNumber: Int!
    s3ObjectKey: String
    createdAt: Date!
    updatedAt: Date!
  }
`;
